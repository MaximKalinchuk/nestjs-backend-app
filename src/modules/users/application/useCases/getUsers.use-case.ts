import { Injectable } from "@nestjs/common";
import { AuthService } from "../../../../modules/auth/application/auth.service";
import { UsersRepository } from "../../infrastructure/users.repository";
import { CreateUserViewModel } from "../dto/createUser-view-model.dto";


@Injectable()
export class GetUsersUseCase {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly authService: AuthService) {}

    async execute(token: string): Promise<CreateUserViewModel[]> {
            await this.authService.checkTokenInDataBase(token)
            return this.usersRepository.getUsers()
        }
}