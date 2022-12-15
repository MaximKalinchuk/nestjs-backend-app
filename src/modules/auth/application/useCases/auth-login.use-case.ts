import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../../../modules/users/application/users.service";
import { LoginUserInputModel } from "../../api/models/loginUser.model";
import { AuthService } from "../auth.service";
import { Tokens } from "../dto/tokens-view-model.dto";
import { compare } from 'bcryptjs';
import { UsersRepository } from "../../../../modules/users/infrastructure/users.repository";
import { SessionsService } from "../../../../modules/sessions/application/sessions.service";


@Injectable()
export class AuthLoginUseCase {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService,
                private readonly usersRepository: UsersRepository,
                private readonly sessionsService: SessionsService,) {}

    async execute(userData: LoginUserInputModel): Promise<Tokens> {
        const userByEmail = await this.usersService.getUserByEmail(userData.email)

        if (!userByEmail) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }

        const isPasswordEquil = await compare(userData.password, userByEmail.password)

        if (!isPasswordEquil) {
            throw new UnauthorizedException('Неверный пароль')
        }
        const user = await this.usersRepository.getUserWithRolesById(userByEmail.id);

        const tokens = await this.authService.generateToken(user)

        await this.authService.updateRefreshTokenInDataBase(user, tokens)

        if (user.refresh_token) {
            await this.sessionsService.saveUsedToken(user.refresh_token)
        }

        return tokens
    }
}