import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './domain/entity/users.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GiveBanUseCase } from './application/useCases/giveBan.use-case';
import { GiveRoleUseCase } from './application/useCases/giveRole.use-case';
import { CreateUserUseCase } from './application/useCases';
import { GetUsersUseCase } from './application/useCases/getUsers.use-case';

const useCases = [
    CreateUserUseCase,
    GiveBanUseCase,
    GiveRoleUseCase,
    GetUsersUseCase,
]

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        RolesModule, JwtModule, forwardRef(() => AuthModule) 
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, ...useCases],
    exports: [UsersService, UsersRepository, CreateUserUseCase]
})
export class UsersModule {}
