import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-auth.rt.guard';
import { RtStrategy } from '../common/strategies/jwt-auth.rt.strategy';
import { AtStrategy } from '../common/strategies/jwt.strategy';
import { TypeOrmConfigService } from '../configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [
    AtStrategy,
    RtStrategy, 
    {
      provide: 'APP_GUARD',
      useClass: JwtRefreshAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
],
})
export class AppModule {}
