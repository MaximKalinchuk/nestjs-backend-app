import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleViewModel } from '../application/dto/createRole-view-model.dto';
import { RolesService } from '../application/roles.service';
import { CreateRoleInputModel } from './models/createRole.model';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesServics: RolesService) {}

    @Post()
    async createRole(@Body() roleData: CreateRoleInputModel): Promise<CreateRoleViewModel> {
        return await this.rolesServics.createRole(roleData)
    }
}
