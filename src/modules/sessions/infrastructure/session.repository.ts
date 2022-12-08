import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SessionsEntity } from '../domain/entity/sessions.entity';


@Injectable()
export class SessionsRepository {
    constructor(@InjectRepository(SessionsEntity) private readonly sessionsRepository: Repository<SessionsEntity>) {}

    async saveUsedToken(token: string): Promise<void> {
        await this.sessionsRepository.save({token: token})
    }

    async findUsedToken(token: string): Promise<SessionsEntity> {
        return await this.sessionsRepository.findOneBy({token: token})
    }

}