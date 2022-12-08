import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './domain/entity/users.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        RolesModule, JwtModule, forwardRef(() => AuthModule) 
    ],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersService, UsersRepository]
})
export class UsersModule {}
