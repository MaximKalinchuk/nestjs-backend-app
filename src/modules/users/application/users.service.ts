import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserInputModel } from '../api/models/createUser.model';
import { UsersEntity } from '../domain/entity/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserViewModel } from './dto/createUser-view-model.dto';
import { RolesRepository } from '../../roles/intarface/roles.repository';
import { BanUserInputModel } from '../api/models/banUser.model';
import { giveRoleToUserInputModel } from '../api/models/giveRoleToUser.model';
import { UpdateRefrashUserInputModel } from '../api/models/updateUser.model';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository,
                private readonly rolesRepository: RolesRepository) {}

    async createUser(userData: CreateUserInputModel): Promise<CreateUserViewModel> {
        const newUser = new UsersEntity()
        Object.assign(newUser, userData)
        const userFromDataBase = await this.usersRepository.createUsers(newUser)
        const userWithRoles = await this.usersRepository.getUserWithRolesById(userFromDataBase.id)
        const roleByName = await this.rolesRepository.getRoleByName('USER')
  
        userWithRoles.userRoles.push(roleByName)
        const updateUserWithRoles = await this.usersRepository.createUsers(userWithRoles)

        return this.buildResponse(updateUserWithRoles);
    }

    async updateRefreshUser(userData: UpdateRefrashUserInputModel) {
        this.usersRepository.updateRefreshUser(userData)
    }

    async getUsers(): Promise<CreateUserViewModel[]> {
        return this.usersRepository.getUsers()
    }

    async getUserByEmail(email: string): Promise<CreateUserViewModel> {
        return this.usersRepository.getUserByEmail(email)
    }

    async getUserByUsername(username: string): Promise<CreateUserViewModel> {
        return this.usersRepository.getUserByUsername(username)
    }

    async giveBan(userData: BanUserInputModel): Promise<CreateUserViewModel> {
        const user = await this.usersRepository.getUserByUsername(userData.username);

        if(!user) {
            throw new HttpException('Такой пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        const updateUser = {...user, banned: true, BanReason: userData.BanReason}

        return await this.usersRepository.createUsers(updateUser)
    }

    async giveRole(userData: giveRoleToUserInputModel): Promise<CreateUserViewModel> {
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
        return this.buildResponse(updateUserWithRoles)
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
