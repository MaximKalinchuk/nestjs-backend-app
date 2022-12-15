import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../infrastructure/users.repository";
import { CreateUserViewModel } from "../dto/createUser-view-model.dto";


@Injectable()
export class GetUsersUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(): Promise<CreateUserViewModel[]> {
            return this.usersRepository.getUsers()
        }
}