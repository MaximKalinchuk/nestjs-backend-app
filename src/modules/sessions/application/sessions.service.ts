import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../infrastructure/session.repository';
import { SessionsEntity } from '../domain/entity/sessions.entity';

@Injectable()
export class SessionsService {
    constructor(private readonly sessionsRepository: SessionsRepository) {}

    async saveUsedToken(token: string): Promise<void> {
        await this.sessionsRepository.saveUsedToken(token)
    }

    async findUsedToken(token: string): Promise<SessionsEntity> {
        return await this.sessionsRepository.findUsedToken(token)
    }
}
