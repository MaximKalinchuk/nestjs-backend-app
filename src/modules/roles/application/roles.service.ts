import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../infrastructure/roles.repository';


@Injectable()
export class RolesService {

    constructor(private readonly rolesRepository: RolesRepository) {}

}
