import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserInputModel {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: 'alex@mail.ru' , description: 'Почта пользователя'})
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: '12345' , description: 'Пароль пользователя'})
    readonly password: string;
}