import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(dto: loginDto) {
    try {
      let user = await this.validateUser(dto)      
      const payload: jwtPayload = {
        sub: user._id.toString(),
        username: user.username,
        role: user.role
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      return error?.response;
    }
  }

  async register(dto: SignUpDto) {
    return this.userService.create(dto);
  }

  async logout() {
    return 'Logout successful';
  }

  private async validateUser(dto: loginDto) {
    let user: any
    if (isEmail(dto.emailOrUsername)) {
        user = await this.userService.findByEmail(dto.emailOrUsername);
      } else {
        user = await this.userService.findByUsername(dto.emailOrUsername);
      }

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.password) {
        throw new NotFoundException('User has no password set');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      if (!await bcrypt.compare(dto.password, user.password)) {
        throw new NotFoundException('Invalid password');
      }
      return user
  }
}
