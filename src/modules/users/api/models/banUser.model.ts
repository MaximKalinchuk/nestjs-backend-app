import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BanUserInputModel {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Alex' , description: 'Имя пользователя'})
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Spamer' , description: 'Причина бана пользователя'})
    readonly BanReason: string;
}