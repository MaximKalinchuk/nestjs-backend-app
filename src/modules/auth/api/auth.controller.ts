import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../application/auth.service';
import { Tokens } from '../application/dto/tokens-view-model.dto';
import { LoginUserInputModel } from './models/loginUser.model';
import { RegisterUserInputModel } from './models/registerUser.model';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthLoginUseCase, AuthLogoutUseCase, AuthRefreshUseCase, AuthRegisterUseCase } from '../application/useCases';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService,
                private readonly authLoginUseCase: AuthLoginUseCase,
                private readonly authLogoutUseCase: AuthLogoutUseCase,
                private readonly authRefreshUseCase: AuthRefreshUseCase,
                private readonly authRegisterUseCase: AuthRegisterUseCase,) {}

    @Public()
    @Post('register')
    async register(@Body() userData: RegisterUserInputModel, @Res({passthrough: true}) res: Response): Promise<Omit<Tokens, "refresh_token">> {
        const tokens = await this.authRegisterUseCase.execute(userData)
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
        const tokens = await this.authLoginUseCase.execute(userData)
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
        // console.log('1', refresh_token)
        const tokens = await this.authRefreshUseCase.execute(refresh_token);
        // console.log('2', tokens.refresh_token)
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
        await this.authLogoutUseCase.execute(refresh_token)
        res.clearCookie('refresh_token')
        return 'Вы успешно вышли из системы.'
    }
}
