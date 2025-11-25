import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { loginDto } from 'src/auth/dto/login.dto';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';


@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('register')
  register(@Body() dto: SignUpDto) {
    return this.apiGatewayService.register(dto);
  }

  @Post('login')
  login(@Body() dto: loginDto) {
    return this.apiGatewayService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Post('createProfile')
  createProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.apiGatewayService.createProfile(dto, req['user']);
  }

  @UseGuards(AuthGuard)
  @Get('getProfile')
  getProfile(@Req() req: Request) {
    return this.apiGatewayService.getProfile(req['user']);
  }

  @UseGuards(AuthGuard)
  @Patch('updateProfile')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.apiGatewayService.updateProfile(dto, req['user']);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteAccount')
  deleteUser(@Req() req: Request) {
    return this.apiGatewayService.deleteAccount(req['user'])
  }


  @UseGuards(AuthGuard)
  @Get('viewMessage')
  viewMessage() {
    return this.apiGatewayService.viewMessage();
  }

  @UseGuards(AuthGuard)
  @Post('sendMessage')
  sendMessage(@Body() dto: CreateMessageDto) {
    return this.apiGatewayService.sendMessage(dto);
  }
}
