import { ApiProperty } from '@nestjs/swagger';
import { RolesEntity } from '../../../roles/domain/entity/roles.entity';
export class GiveRoleViewModel {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    readonly id: number;

    @ApiProperty({example: 'Alex', description: 'Имя пользователя'})
    readonly username: string;

    @ApiProperty({example: 'alex@mail.ru', description: 'Почтовый адрес'})
    readonly email: string;

    @ApiProperty({example: '12345', description: 'Пароль'})
    readonly password: string;

    @ApiProperty({example: 'false', description: 'Забанен пользователь или нет'})
    readonly banned: boolean;

    @ApiProperty({example: '', description: 'Причина бана пользователя'})
    readonly BanReason: string;

    @ApiProperty({example: [ { id: 2, value: "USER", description: "Пользователь" }, { id: 3, value: "MODER", description: "Модератор" }], description: 'Роли пользователя'})
    readonly userRoles: RolesEntity[];
}