import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;
}
