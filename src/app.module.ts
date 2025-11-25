import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/user_messaging', {
      onConnectionCreate: (connection) => {
        console.log('MongoDB connected:', connection.name);
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('error', (error) => console.error('MongoDB connection error:', error));
        return connection;
      },
    }), 
    
    UserModule, AuthModule, MessageModule, ApiGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
