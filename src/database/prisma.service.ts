import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { NODE_ENVIRONMENT } from '../common/assets';
import { PrismaSoftDeleteMiddleware } from '../common/middleware';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.getOrThrow<string>('DATABASE_URL'),
        },
      },
      log:
        configService.getOrThrow<string>('NODE_ENV') ===
        NODE_ENVIRONMENT.DEVELOPMENT
          ? [
              {
                emit: 'event',
                level: 'query',
              },
              'error',
              'info',
              'warn',
            ]
          : [],
    });

    this.$on<any>('query', (e: Prisma.QueryEvent) => {
      console.info(
        `Query: ${e.query}` + ` ${e.params}` + ` duration: ${e.duration} ms`
      );
    });
  }

  async onModuleInit() {
    await this.$connect();

    PrismaSoftDeleteMiddleware(this);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
