import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env'] })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
