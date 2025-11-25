import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { jwtPayload } from 'src/common/types';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern({cmd: 'message:send'})
  sendMessage(@Payload() data: any) {
    return this.messageService.sendMessage(data);
  }

  @MessagePattern({cmd: 'message:viewMessage'})
  viewMessage(@Payload() data: any) {
    return this.messageService.viewMessage(data);
  }

  @MessagePattern({cmd: 'message:getChatList'})
  getChatList(@Payload() userId: jwtPayload) {
    return this.messageService.getChatList(userId);
  }
}
