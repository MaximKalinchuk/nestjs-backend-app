import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserInputModel {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Alex', description: 'Имя пользователя'})
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: 'alex@mail.ru', description: 'Почтовый адрес'})
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: '12345', description: 'Пароль пользователя'})
    readonly password: string;
}