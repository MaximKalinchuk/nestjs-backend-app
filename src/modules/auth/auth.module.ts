import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthLoginUseCase, AuthLogoutUseCase, AuthRefreshUseCase, AuthRegisterUseCase } from './application/useCases';

const useCases = [
  AuthLoginUseCase,
  AuthLogoutUseCase,
  AuthRefreshUseCase,
  AuthRegisterUseCase,
]

@Module({
  imports: [
    SessionsModule,
    UsersModule, 
    JwtModule.register({})
],
  controllers: [AuthController],
  providers: [AuthService, ...useCases],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
