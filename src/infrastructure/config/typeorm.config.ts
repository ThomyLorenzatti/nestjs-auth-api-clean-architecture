import { DataSource, DataSourceOptions } from 'typeorm';
import { UserORMEntity } from '../orm/entities/UserORMEntity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserORMEntity],
  synchronize: false,
  migrations: ['dist/infrastructure/orm/migration/*.ts'],
};

export const typeOrmConfig = config;
export const connectionSource = new DataSource(config as DataSourceOptions);
