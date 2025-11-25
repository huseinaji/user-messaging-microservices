import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { jwtPayload } from 'src/common/types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern({cmd: 'user:findAll'})
  findAll() {
    return this.userService.findAll()
  }

  @MessagePattern({cmd: 'user:createProfile'})
  @MessagePattern({cmd: 'user:updateProfile'})
  createProfile(@Payload() data: any) {
    return this.userService.upsertProfile(data);
  }

  @MessagePattern({cmd: "user:getProfile"})
  getProfile(@Payload() data: jwtPayload) {
    return this.userService.getProfile(data)
  }

  @MessagePattern('updateUser')
  update(@Payload() dto: UpdateUserDto) {
    return this.userService.update(dto.id, dto);
  }

  @MessagePattern({cmd: 'user:deleteAccount'})
  deleteAccount(@Payload() data: jwtPayload) {
    return this.userService.deleteAccount(data);
  }

  @MessagePattern({cmd: 'user:deactivateAccount'})
  deactivateAccount(@Payload() userId: string) {
    return this.userService.deactivateAccount(userId);
  }

  @MessagePattern({cmd: 'user:activateAccount'})
  activateAccount(@Payload() userId: string) {
    return this.userService.activateAccount(userId);
  }
}
