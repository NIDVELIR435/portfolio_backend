import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly appPort: number;
  public readonly nodeWnv: string;
  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbUsername: string;
  public readonly dbPassword: string;
  public readonly dbName: string;
  public readonly dbSynchronize: boolean;
  public readonly dbLogging: boolean;

  constructor(private configService: ConfigService) {
    this.appPort = Number(this.get('APP_PORT'));
    this.nodeWnv = this.get('NODE_ENV');
    this.dbHost = this.get('DB_HOST');
    this.dbPort = Number(this.get('DB_PORT'));
    this.dbUsername = this.get('DB_USERNAME');
    this.dbPassword = this.get('DB_PASSWORD');
    this.dbName = this.get('DB_NAME');
    this.dbSynchronize = this.get('DB_SYNCHRONIZE') === 'true';
    this.dbLogging = this.get('DB_LOGGING') === 'true';
  }

  public get<T = string>(name: string): T {
    return this.configService.getOrThrow<T>(name);
  }

  public getOptional<T = string>(name: string): T | undefined {
    return this.configService.get<T>(name);
  }
}
