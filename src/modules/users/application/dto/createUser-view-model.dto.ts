import { RolesEntity } from '../../../roles/domain/entity/roles.entity';
export class CreateUserViewModel {

    readonly id: number;

    readonly username: string;

    readonly email: string;

    readonly password: string;

    readonly banned: boolean;

    readonly BanReason: string;

    readonly userRoles: RolesEntity[];
}