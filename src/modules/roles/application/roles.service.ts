import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleInputModel } from '../api/models/createRole.model';
import { RolesRepository } from '../intarface/roles.repository';
import { CreateRoleViewModel } from './dto/createRole-view-model.dto';

@Injectable()
export class RolesService {

    constructor(private readonly rolesRepository: RolesRepository) {}

    async createRole(roleData: CreateRoleInputModel): Promise<CreateRoleViewModel> {

        const roleByName = await this.rolesRepository.getRoleByName(roleData.role)

        if (roleByName) {
            throw new HttpException('Такая роль уже добавлена', HttpStatus.BAD_REQUEST)
        }

        return await this.rolesRepository.createRole(roleData)
    }
}