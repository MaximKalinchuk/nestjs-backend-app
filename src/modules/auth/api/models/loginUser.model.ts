import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserInputModel {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}