import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly appPort: number;
  public readonly nodeEnv: string;
  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbUsername: string;
  public readonly dbPassword: string;
  public readonly dbName: string;
  public readonly dbSynchronize: boolean;
  public readonly dbLogging: boolean;
  public readonly bcryptSalt: number;
  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;
  public readonly backendName: string;
  public readonly telegramToken: string;

  constructor(private configService: ConfigService) {
    this.appPort = Number(this.get('APP_PORT'));
    this.nodeEnv = this.get('NODE_ENV');
    this.dbHost = this.get('DB_HOST');
    this.dbPort = Number(this.get('DB_PORT'));
    this.dbUsername = this.get('DB_USERNAME');
    this.dbPassword = this.get('DB_PASSWORD');
    this.dbName = this.get('DB_NAME');
    this.dbSynchronize = this.get('DB_SYNCHRONIZE') === 'true';
    this.dbLogging = this.get('DB_LOGGING') === 'true';
    this.bcryptSalt = Number(this.get('BCRYPT_SALT'));
    this.jwtSecret = this.get('JWT_SECRET');
    this.jwtExpiresIn = this.get('JWT_EXPIRES_IN');
    this.backendName = this.get('BACKEND_NAME');
    this.telegramToken = this.get('TELEGRAM_TOKEN');
  }

  public get<T = string>(name: string): T {
    return this.configService.getOrThrow<T>(name);
  }

  public getOptional<T = string>(name: string): T | undefined {
    return this.configService.get<T>(name);
  }
}
