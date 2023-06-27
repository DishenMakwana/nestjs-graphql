import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class GraphQLLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const logger: Logger = new Logger(GraphQLLoggerMiddleware.name);

    const start = Date.now();

    // Add a listener to the 'close' event of the response object
    res.on('close', () => {
      const responseTime = Date.now() - start;
      const { query, variables } = req.body;

      if (query.includes('IntrospectionQuery')) return;

      // Log the GraphQL request information
      logger.log(`GraphQL Request: ${query}`);
      logger.log(`Variables: ${JSON.stringify(variables)}`);
      logger.log(`Response Time: ${responseTime}ms`);
    });

    // Call the next middleware or route handler
    next();
  }
}
