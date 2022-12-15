import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionsService } from "../../../../modules/sessions/application/sessions.service";
import { UsersService } from "../../../../modules/users/application/users.service";
import { UsersRepository } from "../../../../modules/users/infrastructure/users.repository";
import { AuthService } from "../auth.service";
import { Tokens } from "../dto/tokens-view-model.dto";
import { compare } from 'bcryptjs';


@Injectable()
export class AuthRefreshUseCase {
    constructor(private readonly authService: AuthService,
                private readonly usersRepository: UsersRepository,
                private readonly sessionsService: SessionsService,) {}

    async execute(token: string): Promise<Tokens> {
        await this.authService.checkToken(token)
        const userFromRequest = await this.authService.decodeToken(token)
        const user = await this.usersRepository.getUserWithRolesById(userFromRequest.id);
        

        if (!user) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }


        const isRefreshTokensEquel = await compare(token, user.refresh_token)
        if(!isRefreshTokensEquel) {
            throw new UnauthorizedException('Токены не совпадают')
        }

        const tokens = await this.authService.generateToken(user);

        await this.authService.updateRefreshToken(user, tokens)
        await this.sessionsService.saveUsedToken(token)

        return tokens
    }
}