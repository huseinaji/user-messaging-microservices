import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt-ts';

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  // Mock data
  const mockUser = {
    _id: '1234567890',
    email: 'test@mail.com',
    username: 'testuser',
    password: 'hashedPassword',
    displayName: 'Test User',
    gender: 'male',
    birthDay: new Date(),
    horoscope: 'Gemini',
    zodiac: 'Gemini',
    height: '170',
    weight: '70',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      // findById: jest.fn(),
      // findByIdAndUpdate: jest.fn(),
      // find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    const dto: CreateUserDto = {
      username: 'testuser',
      email: 'test@mail.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Mock findOne untuk email dan username
    userModel.findOne.mockResolvedValue(null);

    // Mock create + save
    userModel.create.mockImplementation((data: CreateUserDto) => ({
      ...mockUser,
      ...data,
      save: jest.fn().mockResolvedValue(mockUser),
    }));

    // Mock bcrypt.hash supaya tidak hash asli
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    const result = await service.create(dto);
    console.log(result);

    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
    expect(userModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: dto.email }),
    );
  });
});
