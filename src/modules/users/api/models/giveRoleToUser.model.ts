import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class giveRoleToUserInputModel {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Alex' , description: 'Имя пользователя'})
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'MODER' , description: 'Роль пользователя'})
    readonly rolename: string;
}