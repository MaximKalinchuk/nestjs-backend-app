import { ApiProperty } from '@nestjs/swagger';
import { RolesEntity } from '../../../roles/domain/entity/roles.entity';
export class CreateUserViewModel {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    readonly id: number;

    @ApiProperty({example: 'Alex', description: 'Имя пользователя'})
    readonly username: string;

    @ApiProperty({example: 'alex@mail.ru', description: 'Почтовый адрес'})
    readonly email: string;

    @ApiProperty({example: '$2a$05$aMt5edSXowaHmJAhe9.TsuKkmsowZkkfjrF3zgP8qbo/9kaJf/P1i', description: 'Захешированный пароль пользователя'})
    readonly password: string;

    @ApiProperty({example: 'true', description: 'Забанен пользователь или нет'})
    readonly banned: boolean;

    @ApiProperty({example: 'Spam', description: 'Причина бана пользователя'})
    readonly BanReason: string;

    @ApiProperty({example: [ { id: 2, value: "USER", description: "Пользователь" }], description: 'Роли пользователя'})
    readonly userRoles: RolesEntity[];
}