import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly appPort: number;
  public readonly nodeEnv: string;
  public readonly postgresContainerName: string;
  public readonly postgresExternalHost: string;
  public readonly postgresPort: number;
  public readonly postgresUser: string;
  public readonly postgresPassword: string;
  public readonly postgresdb: string;
  public readonly postgresSynchronize: boolean;
  public readonly postgresLogging: boolean;
  public readonly bcryptSalt: number;
  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;
  public readonly backendName: string;
  public readonly telegramToken: string;

  constructor(private configService: ConfigService) {
    this.appPort = Number(this.get('APP_PORT'));
    this.nodeEnv = this.get('NODE_ENV');
    this.postgresContainerName = this.get('POSTGRES_CONTAINER_NAME');
    this.postgresExternalHost = this.get('POSTGRES_EXTERNAL_HOST');
    this.postgresPort = Number(this.get('POSTGRES_PORT'));
    this.postgresUser = this.get('POSTGRES_USER');
    this.postgresPassword = this.get('POSTGRES_PASSWORD');
    this.postgresdb = this.get('POSTGRES_DB');
    this.postgresSynchronize = this.get('POSTGRES_SYNCHRONIZE') === 'true';
    this.postgresLogging = this.get('POSTGRES_LOGGING') === 'true';
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
