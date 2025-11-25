import { IsString } from "class-validator";

export class loginDto {
    @IsString()
    emailOrUsername: string;
    @IsString()
    password: string;
}
