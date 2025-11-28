import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./entities/user.entity";
import * as bcrypt from 'bcrypt'
import { Model } from "mongoose";

@Injectable()
export class AdminSeeder implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async onModuleInit() {
    const adminEmail = 'admin@mail.com';
    const existingAdmin = await this.userModel.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await this.userModel.create({
        email: adminEmail,
        password: hashedPassword,
        username: 'admin',
        displayName: 'Super Admin',
        role: 'admin',           
        isActive: true,
      });

      console.log('Admin user created:');
      console.log('   Email: admin@youapp.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    } else {
      console.log('Admin user already exists');
    }
  }
}