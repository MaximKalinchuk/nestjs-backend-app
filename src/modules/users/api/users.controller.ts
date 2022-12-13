import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateUserViewModel } from '../application/dto/createUser-view-model.dto';
import { UsersService } from '../application/users.service';
import { BanUserInputModel } from './models/banUser.model';
import { CreateUserInputModel } from './models/createUser.model';
import { giveRoleToUserInputModel } from './models/giveRoleToUser.model';
import { RolesGuard } from '../../../common/guards/roles.guard';


@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() userData: CreateUserInputModel): Promise<CreateUserViewModel>{
        return await this.usersService.createUser(userData)
    }

    @Get()
    async getUsers(): Promise<CreateUserViewModel[]> {
        return await this.usersService.getUsers()
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/ban')
    async giveBan(@Body() userData: BanUserInputModel): Promise<CreateUserViewModel>{
        return await this.usersService.giveBan(userData)
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/role')
    async role(@Body() userData: giveRoleToUserInputModel): Promise<CreateUserViewModel> {
        return await this.usersService.giveRole(userData)
    }
}
