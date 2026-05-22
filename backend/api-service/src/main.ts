import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { API_CONFIG } from './shared/constants';
import { validateOrmConfig } from './config/ormconfig';
import { validateRedisConfig } from './config/redis.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  validateOrmConfig();
  validateRedisConfig();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.setGlobalPrefix(API_CONFIG.PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:24000'],
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = API_CONFIG.PORT;
  await app.listen(port);

  logger.log(`Application is running on: http://0.0.0.0:${port}`);
  logger.log(`Health check available at: http://0.0.0.0:${port}/health`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});