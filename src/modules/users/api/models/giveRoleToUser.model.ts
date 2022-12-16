import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class giveRoleToUserInputModel {

    @IsNumber()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly rolename: string;
}