import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UsersEntity } from '../../modules/users/domain/entity/users.entity';
import { SessionsEntity } from '../../modules/sessions/domain/entity/sessions.entity';
import { RolesEntity } from 'src/modules/roles/domain/entity/roles.entity';

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
  entities: [UsersEntity, SessionsEntity, RolesEntity],
  migrations: ['src/database/seeds/*{.ts,.js}'],
  synchronize: false,
};

export const AppDataSource: DataSource = new DataSource(config);
