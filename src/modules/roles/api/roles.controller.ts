import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { CreateRoleViewModel } from '../application/dto/createRole-view-model.dto';
import { RolesService } from '../application/roles.service';
import { CreateRoleUseCase } from '../application/useCases';
import { CreateRoleInputModel } from './models/createRole.model';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesServics: RolesService,
                private readonly createRoleUseCase: CreateRoleUseCase) {}
                
    @ApiExcludeEndpoint()            
    @Post()
    async createRole(@Body() roleData: CreateRoleInputModel): Promise<CreateRoleViewModel> {
        return await this.createRoleUseCase.execute(roleData)
    }
}
