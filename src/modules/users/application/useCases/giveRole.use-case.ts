import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RolesRepository } from '../../../../modules/roles/intarface/roles.repository';
import { giveRoleToUserInputModel } from '../../api/models/giveRoleToUser.model';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserViewModel } from '../dto/createUser-view-model.dto';
import { UsersService } from '../users.service';

@Injectable()
export class GiveRoleUseCase {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly rolesRepository: RolesRepository,
                private readonly usersService: UsersService) {}

    async execute(userData: giveRoleToUserInputModel): Promise<CreateUserViewModel> {
        const user = await this.usersRepository.getUserWithRolesById(userData.id);
        const role = await this.rolesRepository.getRoleByName(userData.rolename);

        if(!user) {
            throw new HttpException('Такой пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        if(!role) {
            throw new HttpException('Такой роли не существует', HttpStatus.BAD_REQUEST)
        }

        user.userRoles.filter((role) => {
            if (role.role === userData.rolename) {
                throw new HttpException('Такая роль уже добавлена', HttpStatus.BAD_REQUEST)
            }
        })

        user.userRoles.push(role)
        const updateUserWithRoles = await this.usersRepository.createUsers(user)
        return this.usersService.buildResponse(updateUserWithRoles)
    }
}