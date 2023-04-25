import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logger/logger.service';
import { AppConfigService } from './config/app-config.service';
import { refreshTokenCookieName } from './auth/constants/refresh_token';
import { StrategyName } from './auth/constants/strategyName';
import * as cookieParser from 'cookie-parser';
import * as process from 'process';

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

  console.log(process.env);
  await app.listen(configService.appPort);
}
bootstrap();
