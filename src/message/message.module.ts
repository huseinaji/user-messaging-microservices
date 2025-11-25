import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCER_SERVICE } from 'src/common/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue:  process.env.RABBITMQ_QUEUE || 'main_queue',
          queueOptions: { durable: true },
        }
      }
    ]),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ])
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
