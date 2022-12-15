import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionsService } from "../../../../modules/sessions/application/sessions.service";
import { UsersService } from "../../../../modules/users/application/users.service";
import { UsersRepository } from "../../../../modules/users/infrastructure/users.repository";
import { AuthService } from "../auth.service";


@Injectable()
export class AuthLogoutUseCase {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService,
                private readonly usersRepository: UsersRepository,
                private readonly sessionsService: SessionsService,) {}

    async execute(token: string): Promise<void> {
        await this.authService.checkToken(token)
        const userFromRequest = await this.authService.decodeToken(token)
        const user = await this.usersRepository.getUserWithRolesById(userFromRequest.id);
        if (!user) {
            throw new UnauthorizedException('Такого пользователя не существует')
        }

        const userWithoutRefreshToken = { ...user, refresh_token: null}
        await this.usersService.updateRefreshUser(userWithoutRefreshToken)
        await this.sessionsService.saveUsedToken(token)
    }
}