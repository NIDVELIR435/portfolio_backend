import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/appConfigModule';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ImageModule } from './image/image.module';
import * as Entities from './db/entities';
import * as Migrations from './db/migrations';
import { LoggerModule } from './common/logger/logger.module';
import { TypeormCustomLogger } from './common/logger/typeorm-logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        type: 'postgres',
        retryAttempts: 20,
        retryDelay: 3000,
        host: appConfigService.dbHost,
        port: appConfigService.dbPort,
        username: appConfigService.dbUsername,
        password: appConfigService.dbPassword,
        database: appConfigService.dbName,
        entities: Object.values(Entities),
        migrations: Object.values(Migrations),
        synchronize: appConfigService.dbSynchronize,
        logging: appConfigService.dbLogging,
        // adds all queries and errors to logger, which will catch and send to particular telegram channel
        logger: new TypeormCustomLogger(appConfigService.dbLogging),
      }),
    }),
    AppConfigModule,
    AuthModule,
    UserModule,
    PortfolioModule,
    ImageModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
