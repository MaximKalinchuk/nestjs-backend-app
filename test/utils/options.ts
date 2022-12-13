import { DataSourceOptions } from 'typeorm';
import { RolesEntity } from '../../src/modules/roles/domain/entity/roles.entity';
import { SessionsEntity } from '../../src/modules/sessions/domain/entity/sessions.entity';
import { UsersEntity } from '../../src/modules/users/domain/entity/users.entity';
import * as dotenv from 'dotenv';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


dotenv.config({
  path: '.env',
});


console.log(process.env.PG_DATABASE)
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

// export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
//   useFactory: (configService: ConfigService) => ({
//     type: 'postgres',
//     host: configService.get('PG_HOST'),
//     port: +configService.get('PG_PORT'),
//     username: configService.get('PG_USERNAME'),
//     password: configService.get('PG_PASSWORD'),
//     database: configService.get('PG_DATABASE'),
//     entities: [UsersEntity, RolesEntity, SessionsEntity],
//     synchronize: true,
//   }),
//   inject: [ConfigService],
//   imports: [ConfigModule],
// });