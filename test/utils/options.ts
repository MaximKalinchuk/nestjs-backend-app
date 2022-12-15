import { DataSourceOptions } from 'typeorm';
import { RolesEntity } from '../../src/modules/roles/domain/entity/roles.entity';
import { SessionsEntity } from '../../src/modules/sessions/domain/entity/sessions.entity';
import { UsersEntity } from '../../src/modules/users/domain/entity/users.entity';
import * as dotenv from 'dotenv';


dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});


// console.log(process.env.PG_DATABASE)
// console.log(`.${process.env.NODE_ENV}.env`)
export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [RolesEntity, SessionsEntity, UsersEntity],
  synchronize: true,
};