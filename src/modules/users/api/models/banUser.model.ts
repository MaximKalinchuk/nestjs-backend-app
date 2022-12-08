import { IsNotEmpty, IsString } from "class-validator";

export class BanUserInputModel {
    
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly BanReason: string;
}