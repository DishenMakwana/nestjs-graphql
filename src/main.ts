import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NODE_ENVIRONMENT } from './common/assets';
import { join } from 'path';
import { PrismaService } from './database/prisma.service';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger: Logger = new Logger(process.env.APP_NAME);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT
        ? ['error', 'warn', 'debug', 'verbose', 'log']
        : ['error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  if (
    configService.getOrThrow<string>('NODE_ENV') ===
    NODE_ENVIRONMENT.DEVELOPMENT
  ) {
    // log all graphql requests
  }

  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'public', 'pages'));

  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const databaseService: PrismaService = app.get(PrismaService);
  await databaseService.enableShutdownHooks(app);

  app.useBodyParser('json', { limit: '50mb' });
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === NODE_ENVIRONMENT.PRODUCTION
          ? undefined
          : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  const enableCors = configService.getOrThrow<boolean>('ENABLE_CORS');
  if (enableCors) {
    app.enableCors();
  }

  await app.listen(configService.getOrThrow<number>('PORT') || 5000, '0.0.0.0');

  logger.debug(`Application is running on: ${await app.getUrl()}`);

  logger.debug(
    `GraphQL is running on: ${configService.getOrThrow<string>(
      'API_BASE_URL'
    )}/graphql`
  );
}
bootstrap();
