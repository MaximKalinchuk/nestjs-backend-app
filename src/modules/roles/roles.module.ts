import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesController } from './api/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './domain/entity/roles.entity';
import { RolesRepository } from './infrastructure/roles.repository';
import { CreateRoleUseCase } from './application/useCases/createRole.use-case';

const useCase = [
  CreateRoleUseCase
]

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [RolesService, RolesRepository, ...useCase],
  controllers: [RolesController],
  exports: [RolesRepository]
})
export class RolesModule {}
