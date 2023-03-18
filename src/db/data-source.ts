import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import * as Entities from './entities';
import * as Migrations from './migrations';

import { AppConfigService } from '../config/app-config.service';
config();

const {
  postgresdb,
  postgresSynchronize,
  postgresPassword,
  postgresUser,
  postgresPort,
  postgresExternalHost,
  postgresLogging,
} = new AppConfigService(new ConfigService());

export default new DataSource({
  type: 'postgres',
  host: postgresExternalHost,
  port: postgresPort,
  username: postgresUser,
  password: postgresPassword,
  database: postgresdb,
  synchronize: postgresSynchronize,
  logging: postgresLogging,
  entities: Object.values(Entities),
  migrations: Object.values(Migrations),
  subscribers: [],
});
