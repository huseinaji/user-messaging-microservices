import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('createMessage')
  create(@Payload() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @MessagePattern('findAllMessage')
  findAll() {
    return this.messageService.findAll();
  }

  @MessagePattern('findOneMessage')
  findOne(@Payload() id: number) {
    return this.messageService.findOne(id);
  }

  @MessagePattern('updateMessage')
  update(@Payload() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(updateMessageDto.id, updateMessageDto);
  }

  @MessagePattern('removeMessage')
  remove(@Payload() id: number) {
    return this.messageService.remove(id);
  }
}
