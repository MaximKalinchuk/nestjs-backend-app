import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleInputModel } from "../api/models/createRole.model";
import { RolesEntity } from "../domain/entity/roles.entity";


export class RolesRepository {

    constructor(@InjectRepository(RolesEntity) private readonly rolesRespository: Repository<RolesEntity>) {}

    async createRole(roleData: CreateRoleInputModel): Promise<RolesEntity> {
        return await this.rolesRespository.save(roleData)
    }

    async getRoleByName(roleName: string): Promise<RolesEntity> {
        return await this.rolesRespository.findOneBy({role: roleName})
    }
}