import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env'], cache: false })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
