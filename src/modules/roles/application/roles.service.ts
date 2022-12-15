import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../intarface/roles.repository';


@Injectable()
export class RolesService {

    constructor(private readonly rolesRepository: RolesRepository) {}

}
