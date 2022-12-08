import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../application/auth.service';
import { Tokens } from '../application/dto/tokens-view-model.dto';
import { LoginUserInputModel } from './models/loginUser.model';
import { RegisterUserInputModel } from './models/registerUser.model';
import { Public } from '../../../common/decorators/public.decorator';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    async register(@Body() userData: RegisterUserInputModel, @Res({passthrough: true}) res: Response): Promise<Omit<Tokens, "refresh_token">> {
        const tokens = await this.authService.register(userData)
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 4000 * 1000,
            httpOnly: true
        })
        return {
            access_token: tokens.access_token
        }
    }

    @Public()
    @Post('login')
    async login(@Body() userData: LoginUserInputModel, @Res({passthrough: true}) res: Response): Promise<Omit<Tokens, "refresh_token">> {
        const tokens = await this.authService.login(userData)
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 3600 * 24 * 30,
            httpOnly: true
        })
        return {
            access_token: tokens.access_token
        }
    }


    @Public()
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response): Promise<Omit<Tokens, "refresh_token">> {
        const refresh_token = req.cookies.refresh_token
        const tokens = await this.authService.refresh(refresh_token);
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 3600 * 24 * 30,
            httpOnly: true
        })
        return {
            access_token: tokens.access_token
        }
    }

    
    @Public()
    @Post('logout')
    async logout(@Req() req: Request, @Res({passthrough: true}) res: Response): Promise<string> {
        const refresh_token = req.cookies.refresh_token
        await this.authService.logout(refresh_token)
        res.clearCookie('refresh_token')
        return 'Вы успешно вышли из системы.'
    }
}
