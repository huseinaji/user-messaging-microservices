import { Module } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayController } from './api-gateway.controller';
import { UserModule } from 'src/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCER_SERVICE } from 'src/common/constant';

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

  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
