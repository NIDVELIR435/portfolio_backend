import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logger/logger.service';
import { AppConfigService } from './config/app-config.service';
import { refreshTokenCookieName } from './auth/constants/refresh_token';
import { StrategyName } from './auth/constants/strategyName';
import * as cookieParser from 'cookie-parser';

console.log(`Command entered: ${process.argv.join(' ')}`);
console.log({
  place: 'in module',
  POSTGRES_CONTAINER_NAME: process.env.POSTGRES_CONTAINER_NAME,
  POSTGRES_EXTERNAL_HOST: process.env.POSTGRES_EXTERNAL_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_SYNCHRONIZE: process.env.POSTGRES_SYNCHRONIZE,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  app.useLogger(app.get(CustomLoggerService));
  app.use(cookieParser());

  const configService = app.get(AppConfigService);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('api')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth(
      refreshTokenCookieName,
      {
        type: 'apiKey',
        //will bug here because it will set to header instead cookie
        in: 'cookie',
        name: refreshTokenCookieName,
        description: 'refresh token',
      },
      StrategyName.jwt_refresh,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.appPort);
}
bootstrap();
