import { Body, Controller, Get, Post, UseGuards, HttpCode, Req, HttpStatus } from '@nestjs/common';
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
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { GiveRoleViewModel } from '../application/dto/giveRole-view-model.dto';

@ApiTags('Операции с пользователями')
@Controller('users')
export class UsersController {

    constructor(private readonly createUserUseCase: CreateUserUseCase,
                private readonly giveBanUseCase: GiveBanUseCase,
                private readonly giveRoleUseCase: GiveRoleUseCase,
                private readonly getUsersUseCase: GetUsersUseCase) {}
    
    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({ status: 201, type: CreateUserViewModel})
    @HttpCode(201)
    @Post()
    async createUser(@Body() userData: CreateUserInputModel): Promise<CreateUserViewModel>{
        return await this.createUserUseCase.execute(userData)
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({ status: 200, type: [CreateUserViewModel]})
    @HttpCode(200)
    @Get()
    async getUsers(@Req() req: Request): Promise<CreateUserViewModel[]> {
        const refresh_token = req.cookies.refresh_token
        return await this.getUsersUseCase.execute(refresh_token)
    }


    @ApiOperation({summary: 'Выдать бан пользователю', description: 'Может только администратор'})
    @ApiResponse({ status: 200, type: CreateUserViewModel})
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/ban')
    async giveBan(@Body() userData: BanUserInputModel): Promise<CreateUserViewModel>{
        return await this.giveBanUseCase.execute(userData)
    }

    @ApiOperation({summary: 'Выдать роль пользователю', description: 'Может только администратор'})
    @ApiResponse({ status: 200, type: GiveRoleViewModel})
    @HttpCode(200)
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('/role')
    async role(@Body() userData: giveRoleToUserInputModel): Promise<GiveRoleViewModel> {
        return await this.giveRoleUseCase.execute(userData)
    }
}
