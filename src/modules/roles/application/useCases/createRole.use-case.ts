import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRoleInputModel } from "../../api/models/createRole.model";
import { RolesEntity } from "../../domain/entity/roles.entity";
import { RolesRepository } from "../../intarface/roles.repository";
import { CreateRoleViewModel } from "../dto/createRole-view-model.dto";


@Injectable()
export class CreateRoleUseCase {
    constructor(private readonly rolesRepository: RolesRepository) {}

    async execute(roleData: CreateRoleInputModel): Promise<CreateRoleViewModel> {

        const roleByName = await this.rolesRepository.getRoleByName(roleData.role)

        if (roleByName) {
            throw new HttpException('Такая роль уже добавлена', HttpStatus.BAD_REQUEST)
        }
        const newRole = new RolesEntity()
        Object.assign(newRole, roleData)

        return await this.rolesRepository.createRole(roleData)
    }
}