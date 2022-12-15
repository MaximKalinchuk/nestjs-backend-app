import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../../../modules/users/application/users.service";
import { RegisterUserInputModel } from "../../api/models/registerUser.model";
import { Tokens } from "../dto/tokens-view-model.dto";
import { hash } from 'bcryptjs';
import { AuthService } from '../auth.service';
import { CreateUserUseCase } from "../../../../modules/users/application/useCases";


@Injectable()
export class AuthRegisterUseCase {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService,
                private readonly createUserUseCase: CreateUserUseCase) {}

    async execute(userData: RegisterUserInputModel): Promise<Tokens> {

        const userByEmail = await this.usersService.getUserByEmail(userData.email)
        const userByUsername = await this.usersService.getUserByUsername(userData.username)

        if(userByEmail) {
            throw new UnauthorizedException('Такой email уже зарегистрирован')
        }

        if(userByUsername) {
            throw new UnauthorizedException('Такой username уже занят')
        }

        const hashPassword = await hash(userData.password, 5)
        const user = await this.createUserUseCase.execute({...userData, password: hashPassword})

        const tokens = await this.authService.generateToken(user)

        this.authService.updateRefreshTokenInDataBase(user, tokens)

        return tokens;
    }
}