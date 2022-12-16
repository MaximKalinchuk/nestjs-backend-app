import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
};

export const AppDataSource: DataSource = new DataSource(config);