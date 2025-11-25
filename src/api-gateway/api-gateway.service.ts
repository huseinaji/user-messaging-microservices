import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { loginDto } from 'src/auth/dto/login.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { PRODUCER_SERVICE } from 'src/common/constant';
import { jwtPayload } from 'src/common/types';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class ApiGatewayService {
  constructor(@Inject(PRODUCER_SERVICE) private readonly client: ClientProxy){}

  findAllUser() {
    return lastValueFrom(this.client.send({cmd: 'user:findAll'}, {}))
  }

  async register(dto: SignUpDto) {
    return lastValueFrom(this.client.send({cmd: 'user:register'}, dto));
  }

  async login(dto: loginDto) {
    return lastValueFrom(this.client.send({cmd: 'user:login'}, dto));
  }
  async createProfile(dto: UpdateUserDto, user: jwtPayload) {
    const payload = {
      ...dto, 
      sub: user.sub
    };
    return lastValueFrom(this.client.send({cmd: 'user:createProfile'}, payload));
  }

  async getProfile(data: jwtPayload) {
    return lastValueFrom(this.client.send({cmd: 'user:getProfile'}, data));
  }

  async updateProfile(dto: UpdateUserDto, user: jwtPayload) {
    const payload = {
      ...dto, 
      sub: user.sub
    };
    return lastValueFrom(this.client.send({cmd: 'user:udpateProfile'}, payload));
  }

  async deleteAccount(data: jwtPayload) {
    return lastValueFrom(this.client.send({cmd: 'user:deleteAccount'}, data));
  }
  
  async deactivateAccount(userId: string) {
    return lastValueFrom(this.client.send({cmd: 'user:deactivateAccount'}, userId));
  }

  async activateAccount(userId: string) {
    return lastValueFrom(this.client.send({cmd: 'user:activateAccount'}, userId));
  }

  async viewMessages(otherUserId: string, user: jwtPayload, page = 1) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'message:viewMessage' },
        { userId: user.sub, otherUserId, page },
      ),
    );
  }

  async sendMessage(dto: CreateMessageDto, user: jwtPayload) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'message:send' },
        { senderId: user.sub, ...dto },
      ),
    );
  }

  async getChatList(userId: jwtPayload) {
    return lastValueFrom(
      this.client.send(
        { cmd: 'message:getChatList' },
        userId
      )
    )
  }
}
