import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInputModel } from "../api/models/createUser.model";
import { UpdateRefrashUserInputModel } from "../api/models/updateUser.model";
import { CreateUserViewModel } from "../application/dto/createUser-view-model.dto";
import { UsersEntity } from '../domain/entity/users.entity';



export class UsersRepository {
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

    async createUsers(userData: CreateUserInputModel): Promise<UsersEntity> {
        return await this.usersRepository.save(userData)
    }

    async getUserWithRolesById(id: number): Promise<UsersEntity> {
        return await this.usersRepository.findOne({
            where: {id}, relations: ['userRoles']
        })
    }

    async updateRefreshUser(userData: UpdateRefrashUserInputModel) {
        return await this.usersRepository.save(userData)   
    }

    async updateUserInDataBase(userData: UsersEntity): Promise<UsersEntity> {
        return await this.usersRepository.save(userData)
    }

    async getUsers(): Promise<UsersEntity[]> {
        return await this.usersRepository.find({relations: ['userRoles']})
    }

    async getUserByEmail(email): Promise<CreateUserViewModel> {
        return await this.usersRepository.findOneBy({email})
    }

    async getUserByUsername(username): Promise<CreateUserViewModel> {
        return await this.usersRepository.findOne({
            where: {username}, relations: ['userRoles']
        })
    }

}