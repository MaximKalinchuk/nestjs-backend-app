import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            ignoreExpiration: false,
            passReqToCallback: false,
            secretOrKey: process.env.PRIVATE_REFRESH_KEY,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const refresh_token = request.cookies.refresh_token
                    if (!refresh_token) {
                        throw new UnauthorizedException();
                    }
                    return refresh_token
                }
            ]),
        })
    }

    async validate(payload: any) {
        return payload.payload; // чтобы вернуть не payload, а user
    }
}