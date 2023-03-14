import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import * as Entities from './entities';
import * as Migrations from './migrations';

import { AppConfigService } from '../config/app-config.service';
config();

const {
  dbName,
  dbSynchronize,
  dbPassword,
  dbUsername,
  dbPort,
  dbHost,
  dbLogging,
} = new AppConfigService(new ConfigService());

export default new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  synchronize: dbSynchronize,
  logging: dbLogging,
  entities: Object.values(Entities),
  migrations: Object.values(Migrations),
  subscribers: [],
});
