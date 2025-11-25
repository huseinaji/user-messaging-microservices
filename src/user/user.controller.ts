import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { jwtPayload } from 'src/common/types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: 'user:createProfile'})
  createProfile(@Payload() data: any) {
    return this.userService.createProfile(data);
  }

  @MessagePattern({cmd: "user:getProfile"})
  getProfile(@Payload() data: jwtPayload) {
    return this.userService.getProfile(data)
  }

  @MessagePattern({cmd: 'user:updateProfile'})
  updateProfile(@Payload() data: any) {
    return this.userService.updateProfile(data);
  }

  @MessagePattern('updateUser')
  update(@Payload() dto: UpdateUserDto) {
    return this.userService.update(dto.id, dto);
  }

  @MessagePattern('user:deleteAccount')
  deleteAccount(@Payload() data: jwtPayload) {
    return this.userService.deleteAccount(data);
  }

  @MessagePattern('user:deactivateProfile')
  deactivateProfile(@Payload() userId: string) {
    return this.userService.deactivateProfile(userId);
  }
}
