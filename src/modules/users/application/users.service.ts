import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserInputModel } from '../api/models/createUser.model';
import { UsersEntity } from '../domain/entity/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserViewModel } from './dto/createUser-view-model.dto';

import { UpdateRefrashUserInputModel } from '../api/models/updateUser.model';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository,) {}

    // async updateRefreshUser(userData: UpdateRefrashUserInputModel) {
    //     await this.usersRepository.updateRefreshUser(userData)
    // }

    async updateUserInDataBase(userData: UsersEntity): Promise<UsersEntity> {
        return await this.usersRepository.updateUserInDataBase(userData)
    }

    async getUserByEmail(email: string): Promise<CreateUserViewModel> {
        return this.usersRepository.getUserByEmail(email)
    }

    async getUserByUsername(username: string): Promise<CreateUserViewModel> {
        return this.usersRepository.getUserByUsername(username)
    }

    buildResponse(user: UsersEntity): CreateUserViewModel {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            banned: user.banned,
            BanReason: user.BanReason,
            userRoles: user.userRoles
        }
    }
}
