import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { RolesEntity } from '../modules/roles/domain/entity/roles.entity';
import { UsersEntity } from '../modules/users/domain/entity/users.entity';
import { SessionsEntity } from '../modules/sessions/domain/entity/sessions.entity';



export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [UsersEntity, RolesEntity, SessionsEntity],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    // cli: {
    //     migrationsDir: 'src/migrations'
    // }
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});