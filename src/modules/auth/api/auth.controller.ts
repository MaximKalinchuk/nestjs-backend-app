import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../application/auth.service';
import { Tokens } from '../application/dto/tokens-view-model.dto';
import { LoginUserInputModel } from './models/loginUser.model';
import { RegisterUserInputModel } from './models/registerUser.model';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthLoginUseCase, AuthLogoutUseCase, AuthRefreshUseCase, AuthRegisterUseCase } from '../application/useCases';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessToken } from '../application/dto/accsessToken-view-model.dto';
import { LogoutViewModel } from '../application/dto/logout-view-model.dto';

@ApiTags('Авторизация')
@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService,
                private readonly authLoginUseCase: AuthLoginUseCase,
                private readonly authLogoutUseCase: AuthLogoutUseCase,
                private readonly authRefreshUseCase: AuthRefreshUseCase,
                private readonly authRegisterUseCase: AuthRegisterUseCase,) {}

    @Public()
    @HttpCode(201)
    @Post('register')
    @ApiOperation({summary: 'Зарегистрироваться'})
    @ApiResponse({ status: 201, type: AccessToken})
    async register(@Body() userData: RegisterUserInputModel, @Res({passthrough: true}) res: Response): Promise<AccessToken> {
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
    @HttpCode(200)
    @Post('login')
    @ApiOperation({summary: 'Авторизироваться'})
    @ApiResponse({ status: 200, type: AccessToken})
    async login(@Body() userData: LoginUserInputModel, @Res({passthrough: true}) res: Response): Promise<AccessToken> {
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
    @HttpCode(200)
    @Post('refresh')
    @ApiOperation({summary: 'Обновить Refresh и Access токеты'})
    @ApiResponse({ status: 200, type: AccessToken})
    async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response): Promise<AccessToken> {
        const refresh_token = req.cookies.refresh_token
        const tokens = await this.authRefreshUseCase.execute(refresh_token);
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 3600 * 24 * 30,
            httpOnly: true
        })
        return {
            access_token: tokens.access_token
        }
    }

    
    @Public()
    @HttpCode(200)
    @Post('logout')
    @ApiOperation({summary: 'Выйти из учётной записи'})
    @ApiResponse({ status: 200, type: LogoutViewModel})
    async logout(@Req() req: Request, @Res({passthrough: true}) res: Response): Promise<LogoutViewModel> {
        const refresh_token = req.cookies.refresh_token
        await this.authLogoutUseCase.execute(refresh_token)
        res.clearCookie('refresh_token')
        return { message: 'Вы успешно вышли из системы.' }
    }
}
