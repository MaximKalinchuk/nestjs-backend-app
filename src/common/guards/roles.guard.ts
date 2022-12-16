import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService,
                private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const rolesFromDecorator = this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass()
            ])

            const user = this.jwtService.verify(token, {secret: process.env.PRIVATE_ACCESS_KEY})
            const hasRole = user.payload.roles.some(role => rolesFromDecorator.includes(role.role))

            if (!hasRole) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
            }
            return hasRole
        } catch (e) {
            console.log(e)
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}