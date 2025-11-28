import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn()
  }

  const mockJwtService = {
    sign: jest.fn()
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {provide: UserService, useValue: mockUserService},
        {provide: JwtService, useValue: mockJwtService}
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access token when user isActive = 1', async () => {
      const user = { 
        _id: '123', 
        email: 'test@mail.com', 
        password: "test123",
        isActive: 1,
        role: 'guest' 
      };

      mockUserService.findByEmail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token-123');

      const result = await service.login({
        emailOrUsername: user.email,
        password: "test123" 
      } as loginDto);

      expect(result).toEqual({ access_token: 'jwt-token-123' });
    });

    it('should retrun user not found if user is null', async () => {
      mockUserService.findByEmail.mockResolvedValue(undefined);
      const result = await service.login({
        emailOrUsername: "test@mail.com",
        password: "test123" 
      } as loginDto)

      console.log('result', result)
      expect(result).rejects.toThrow(NotFoundException)
      expect(result).toEqual({
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404
      })
    })

    it('should retrun user has no password set if user password not found', async () => {
      const user = { 
        _id: '123', 
        email: 'test@mail.com', 
        isActive: 1,
        role: 'guest' 
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      const result = await service.login({
        emailOrUsername: "test@mail.com",
        password: "test123" 
      } as loginDto)

      console.log('result', result)
      expect(result).rejects.toThrow(NotFoundException)
      expect(result).toEqual({
        message: 'User has no password set',
        error: 'Not Found',
        statusCode: 404
      })
    })

    it('sould return account deactivated if user isActive = false', async () => {
      const user = { 
        _id: '123', 
        email: 'test@mail.com', 
        password: "test123",
        isActive: false,
        role: 'guest' 
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      const result = await service.login({
        emailOrUsername: user.email,
        password: user.password 
      } as loginDto)
      console.log(result)
      expect(result).rejects.toThrow(UnauthorizedException)
      expect(result).toEqual({
        message: 'Account is deactivated',
        error: 'Unauthorized',
        statusCode: 401
      })
    })
  });
});
