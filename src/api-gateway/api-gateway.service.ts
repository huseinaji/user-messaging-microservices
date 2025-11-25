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

  async register(dto: SignUpDto) {
    return lastValueFrom(this.client.send({cmd: 'user:register'}, dto));
  }

  async login(dto: loginDto) {
    return lastValueFrom(this.client.send({cmd: 'user:login'}, dto));
  }
  async createProfile(dto: UpdateUserDto, user: jwtPayload) {
    const newData = {...dto, ...user};
    return lastValueFrom(this.client.send({cmd: 'user:createProfile'}, newData));
  }

  async getProfile(data: jwtPayload) {
    return lastValueFrom(this.client.send({cmd: 'user:getProfile'}, data));
  }

  async updateProfile(dto: UpdateUserDto, user: jwtPayload) {
    const newData = {...dto, ...user};
    return lastValueFrom(this.client.send({cmd: 'user:udpateProfile'}, newData));
  }

  async deleteAccount(data: jwtPayload) {
    return lastValueFrom(this.client.send({cmd: 'user:deleteAccount'}, data));
  }
  
  async deactivateProfile(userId: string) {
    return lastValueFrom(this.client.send({cmd: 'user:deleteAccount'}, userId));
  }

  viewMessage() {
    return `This action returns all apiGateway`;
  }

  sendMessage(dto: CreateMessageDto) {
    return `This action returns a #${dto} apiGateway`;
  }
}
