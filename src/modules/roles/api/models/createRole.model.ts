import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleInputModel {

    @IsString()
    @IsNotEmpty()
    readonly role: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}