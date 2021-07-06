import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  let configService: ConfigService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  // somewhere in your initialization file
  app.use(compression());
  
  const SERVER_HOST_PORT = configService.get<number>('SERVER_HOST_PORT');
  const SERVER_HOST_URI = configService.get<string>('SERVER_HOST_URI');
  await app.listen(SERVER_HOST_PORT);
  logger.log(`[Application listening] ${ SERVER_HOST_URI } on port ${ SERVER_HOST_PORT }`);

}
bootstrap();
