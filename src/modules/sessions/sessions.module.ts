import { Module } from '@nestjs/common';
import { SessionsService } from './application/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsEntity } from './domain/entity/sessions.entity';
import { SessionsRepository } from './infrastructure/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionsEntity])],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
