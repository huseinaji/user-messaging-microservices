// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getHoroscope, getZodiac } from 'src/common/utils';

jest.mock('src/common/utils', () => ({
  getZodiac: jest.fn(),
  getHoroscope: jest.fn(),
}));

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  describe('create', () => {
    const createDto: CreateUserDto = {
      email: 'new@user.com',
      username: 'newuser',
      password: 'pass123',
      confirmPassword: 'pass123'
    };

    it('should create user successfully', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null); // email unique
      mockUserModel.findOne.mockResolvedValueOnce(null); // username unique
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPass' as never);
      const mockCreated = { ...createDto, password: 'hashedPass', _id: '123', save: jest.fn() };
      mockUserModel.create.mockResolvedValue(mockCreated);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreated);
      expect(mockUserModel.create).toHaveBeenCalledWith({ ...createDto, password: 'hashedPass' });
      expect(mockCreated.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null); // email ok
      mockUserModel.findOne.mockResolvedValueOnce({ username: createDto.username });
      const result = await service.create(createDto)
      expect(result).toEqual({
        message: 'Username already exists',
        error: 'Conflict',
        statusCode: 409
      });
    });
  });

  describe('upsertProfile', () => {
    const payload = {
      sub: 'user123',
      name: 'John Updated',
      birthDay: '1990-05-15',
    };

    const existingUser = {
      _id: 'user123',
      email: 'john@example.com',
      password: 'xxx',
      username: 'John Updated',
      zodiac: 'Pig',
      heroscope: 'Taurus',
      toObject: jest.fn().mockReturnValue({ _id: 'user123', email: 'john@example.com', password: 'xxx' }),
      save: jest.fn(),
    };

    it('should update profile and calculate zodiac & horoscope', async () => {
      mockUserModel.findById.mockResolvedValue(existingUser);
      (getZodiac as jest.Mock).mockReturnValue('Pig');
      (getHoroscope as jest.Mock).mockReturnValue('Gemini');

      const result = await service.upsertProfile(payload as any);
      console.log(result)
      expect(existingUser.username).toBe('John Updated');
      expect(existingUser.zodiac).toBe('Pig');
      expect(existingUser.heroscope).toBe('Gemini');
      expect(existingUser.save).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.upsertProfile(payload as any)).rejects.toThrow(NotFoundException);
      await expect(service.upsertProfile(payload as any)).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = { email: 'test@mail.com' };
      mockUserModel.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@mail.com');

      expect(result).toBe(user);
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const user = { username: 'testuser' };
      mockUserModel.findOne.mockResolvedValue(user);

      const result = await service.findByUsername('testuser');

      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    const updateDto: UpdateUserDto = { id: 1, email: 'new@mail.com', username: 'newname' };
    const existingUser = { 
      _id: '123', 
      email: 'old@mail.com', 
      username: 'oldname' 
    };

    it('should update user successfully', async () => {
      mockUserModel.findById.mockResolvedValue(existingUser);
      mockUserModel.findOne.mockResolvedValue(null); // no conflict
      const updatedUser = { ...existingUser, ...updateDto };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update('123' as any, updateDto);

      expect(result).toEqual(expect.objectContaining({ email: 'new@mail.com' }));
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException when new email already taken', async () => {
      mockUserModel.findById.mockResolvedValue(existingUser);
      mockUserModel.findOne.mockResolvedValueOnce({ email: updateDto.email });

      await expect(service.update('123' as any, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      const user = { _id: '123' };
      mockUserModel.findById.mockResolvedValue(user);

      const result = await service.deleteAccount({ sub: '123' } as any);

      expect(result).toEqual({ message: 'Profile deleted successfully' });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.deleteAccount({ sub: '999' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivateAccount', () => {
    it('should deactivate user', async () => {
      const updated = { isActive: false };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.deactivateAccount('123');

      expect(result).toBeTruthy();
      expect(result?.isActive).toBe(false);
    });
  });

  describe('activateAccount', () => {
    it('should activate user', async () => {
      const updated = { isActive: true };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.activateAccount('123');
      
      expect(result).toBeTruthy();
      expect(result?.isActive).toBe(true);
    });
  });
});