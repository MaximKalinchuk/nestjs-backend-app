import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class giveRoleToUserInputModel {

    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    readonly rolename: string;
}