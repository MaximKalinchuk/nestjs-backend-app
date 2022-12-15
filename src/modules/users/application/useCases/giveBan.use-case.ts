import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BanUserInputModel } from '../../api/models/banUser.model';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserViewModel } from '../dto/createUser-view-model.dto';

@Injectable()
export class GiveBanUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(userData: BanUserInputModel): Promise<CreateUserViewModel> {
        const user = await this.usersRepository.getUserByUsername(userData.username);

        if(!user) {
            throw new HttpException('Такой пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        const updateUser = {...user, banned: true, BanReason: userData.BanReason}

        return await this.usersRepository.createUsers(updateUser)
    }
}