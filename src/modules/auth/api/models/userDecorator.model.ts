import { RolesEntity } from "../../../../modules/roles/domain/entity/roles.entity";

export class userDecoratorInputModel {
    readonly id: number;

    readonly username: string;

    readonly email: string;

    readonly roles: RolesEntity[];

    readonly refresh_token?: string
}