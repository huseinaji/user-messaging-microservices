import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt-ts';
import { jwtPayload } from 'src/common/types';
import { getHoroscope, getZodiac } from 'src/common/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      //check email uniqueness
      const existingEmail = await this.userModel.findOne({ email: dto.email });
      if (existingEmail) throw new ConflictException('Email already exists');
      
      // check username uniqueness
      const existingUsername = await this.userModel.findOne({ username: dto.username });
      if (existingUsername) throw new ConflictException('Username already exists');
  
      //hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
      
      // create user
      const createdUser = await this.userModel.create(dto);
      createdUser.save();
      return createdUser;
    } catch (error) {
      return error?.response;
    }
  }

  async createProfile(data: (UpdateUserDto & jwtPayload)) {
    const user = await this.userModel.findById(data.sub);
    if (!user) throw new NotFoundException('User not found');
    
    if (data.birthDay != null || data.birthDay != undefined) {
      const date = new Date(data.birthDay)
      user.zodiac = getZodiac(date)
      user.heroscope = getHoroscope(date)
    }
    // Update profile fields
    if (data.interest != null) {
      user.interest = data.interest
    }
    
    for (const key in data as Record<string, any>) {
      if (key == 'sub' || (data[key] == undefined || data[key] == null)) continue
      user[key] = data[key]
    }
    
    await user.save();
    const {password, ...res} = user.toObject();
    return res
  }

  async getProfile(data: jwtPayload) {
    const user = await this.userModel.findById(data.sub).select('-password')
    return user
  }

  async updateProfile(data: UpdateUserDto & jwtPayload) {
    const user = await this.userModel.findById(data.sub);
    if (!user) throw new NotFoundException('User not found');
    
    // Update profile fields
    for (const key in data) {
      if (key != 'sub' && (data[key] != undefined || data[key] != null)) {
        user[key] = data[key]
      }
    }
    
    return user.save();
  }

  async findAll() {
    return await this.userModel.find().select('-password');
  }

  async findOne(id: number) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user; 
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) throw new NotFoundException('User not found');
    
    // If updating email, check for uniqueness
    if (dto.email && dto.email !== existingUser.email) {
      const emailInUse = await this.userModel.findOne({ email: dto.email });
      if (emailInUse) throw new ConflictException('Email already exists');
    }
    // If updating username, check for uniqueness
    if (dto.username && dto.username !== existingUser.username) {
      const usernameInUse = await this.userModel.findOne({ username: dto.username });
      if (usernameInUse) throw new ConflictException('Username already exists');
    }
    
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).select('-password');
  }

  async deleteAccount(data: jwtPayload) {
    try {
      const user = await this.userModel.findById(data.sub);
      if (!user) throw new NotFoundException('User not found');
      await this.userModel.findByIdAndDelete(user._id);
      return {
        message: 'Profile deleted successfully'
      };
    } catch (error) {
      return error?.response;
    }
  }

  async deactivateProfile(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      await this.userModel.findByIdAndUpdate(userId, { isActive: false });
      return { message: 'Account deactivated' };
    } catch (error) {
      return error?.response;
    }
  }
}
