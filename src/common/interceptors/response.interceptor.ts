import {
  CallHandler,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { message } from '../assets/message.asset';
import * as camelize from 'camelize';
import { catchError } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

// export interface Response<T> {
//   data: T;
// }

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger: Logger = new Logger(ResponseInterceptor.name);

    const gqlContext = GqlExecutionContext.create(context);
    const isGraphql = !!gqlContext.getType();

    // console.log('isGraphql', isGraphql);
    // console.log('context', gqlContext.getType());

    const info = gqlContext.getInfo();
    const operationName = info.path.key;

    // console.log('operationName', operationName);

    return next.handle().pipe(
      map((data) => {
        const success_message = this.reflector.get<string[]>(
          'success_message',
          context.getHandler()
        );

        console.log('data', data);

        if (isGraphql) {
          return {
            result: data,
            success: true,
            message: success_message ?? message.SUCCESS_RESPONSE,
          };
        }

        return {
          success: true,
          message: success_message ?? message.SUCCESS_RESPONSE,
          data: data,
        };
      }),

      catchError((error) => {
        if (error.status) {
          return throwError(() => {
            logger.error(error.message, error.stack);

            return new HttpException(
              {
                statusCode: error.status,
                success: false,
                message: error.message,
                stack: error.stack,
                error: error,
              },
              error.status
            );
          });
        }

        return throwError(() => {
          logger.error(error.message, error.stack);

          return new InternalServerErrorException(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              success: false,
              message: error.message,
              stack: error.stack,
              error: error,
            },
            error.status
          );
        });
      })
    );
  }
}
