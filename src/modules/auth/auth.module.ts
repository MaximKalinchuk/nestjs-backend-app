import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    SessionsModule,
    UsersModule, 
    JwtModule.register({})
],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
