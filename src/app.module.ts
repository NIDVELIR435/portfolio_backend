import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/appConfigModule';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import * as Entities from './db/entities';

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
        migrations: ['./db/migrations'],
        synchronize: appConfigService.dbSynchronize,
        logging: appConfigService.dbLogging,
      }),
    }),
    AppConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
