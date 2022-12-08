import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesController } from './api/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './domain/entity/roles.entity';
import { RolesRepository } from './intarface/roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
  exports: [RolesRepository]
})
export class RolesModule {}
