import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  @IsString()
  @IsOptional()
  displayName?: string;
  @IsEnum(['male', 'female'])
  @IsOptional()
  gender?: string;
  @IsDate()
  @IsOptional()
  birthDay?: Date;
  @IsNumber()
  @IsOptional()
  height?: number;
  @IsNumber()
  @IsOptional()
  weight?: number;
  @IsOptional()
  interest?: string[];
}
