import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @MessagePattern({cmd: 'login'})
    login(@Payload() dto: loginDto) {
        return this.authService.login(dto);
    }
    
    @MessagePattern({cmd: 'register'})
    register(@Payload() dto: SignUpDto) {
        console.log("register dto", dto);
        return this.authService.register(dto);
    }

    @MessagePattern('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('logout')
    logout() {
        return this.authService.logout();
    }   
}
