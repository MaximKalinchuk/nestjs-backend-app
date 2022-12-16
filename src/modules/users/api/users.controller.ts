import { Body, Controller, Get, Post, UseGuards, HttpCode } from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateUserViewModel } from '../application/dto/createUser-view-model.dto';
import { UsersService } from '../application/users.service';
import { BanUserInputModel } from './models/banUser.model';
import { CreateUserInputModel } from './models/createUser.model';
import { giveRoleToUserInputModel } from './models/giveRoleToUser.model';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateUserUseCase } from '../application/useCases/createUser.use-case';
import { GiveBanUseCase } from '../application/useCases/giveBan.use-case';
import { GiveRoleUseCase } from '../application/useCases/giveRole.use-case';
import { GetUsersUseCase } from '../application/useCases/getUsers.use-case';


@Controller('users')
export class UsersController {

    constructor(private readonly createUserUseCase: CreateUserUseCase,
                private readonly giveBanUseCase: GiveBanUseCase,
                private readonly giveRoleUseCase: GiveRoleUseCase,
                private readonly getUsersUseCase: GetUsersUseCase) {}
    @HttpCode(201)
    @Post()
    async createUser(@Body() userData: CreateUserInputModel): Promise<CreateUserViewModel>{
        return await this.createUserUseCase.execute(userData)
    }

    @HttpCode(200)
    @Get()
    async getUsers(): Promise<CreateUserViewModel[]> {
        return await this.getUsersUseCase.execute()
    }

    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/ban')
    async giveBan(@Body() userData: BanUserInputModel): Promise<CreateUserViewModel>{
        return await this.giveBanUseCase.execute(userData)
    }

    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/role')
    async role(@Body() userData: giveRoleToUserInputModel): Promise<CreateUserViewModel> {
        return await this.giveRoleUseCase.execute(userData)
    }
}
