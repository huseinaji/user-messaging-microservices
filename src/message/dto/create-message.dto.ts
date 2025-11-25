import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}