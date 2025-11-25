import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PRODUCER_SERVICE } from 'src/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { jwtPayload } from 'src/common/types';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private chatModel: Model<Message>,
    @Inject(PRODUCER_SERVICE) private client: ClientProxy
  ) {}

  async sendMessage(data: { senderId: string; receiverId: string; content: string }) {
    const { senderId, receiverId, content } = data;
    const roomId = [senderId, receiverId].sort().join('_');
    
    const message = {
      sender: senderId,
      content,
      createdAt: new Date(),
      isRead: false,
    };

    const result = await this.chatModel.findOneAndUpdate(
      { roomId },
      {
        $push: {messages: message},
        $set: {lastMessageAt: new Date()},
        $setOnInsert: {participants: [senderId, receiverId]}
      },
      { upsert: true, new: true },
    )

    const latestMessage = result.messages[result.messages.length-1]
    console.log(latestMessage)
    this.client.emit('message:new', {
      roomId,
      message: {
        sender: latestMessage.sender,
        content: latestMessage.content,
        createdAt: latestMessage.createdAt,
        isRead: latestMessage.isRead,
      },
      receiverId,        // biar frontend tahu buat siapa
      senderId,
    });
    return result;
  }

  async viewMessage(data: { userId: string; recipientId: string; page?: number; limit?: number }) {
    const { userId, recipientId, page = 1, limit = 20 } = data;
    const roomId = [userId, recipientId].sort().join('_');
   
    await this.chatModel.updateOne(
      { roomId },
      { $set: { 'messages.$[elem].isRead': true } },
      {
        arrayFilters: [{ 'elem.isRead': false, 'elem.sender': userId, }],
      },
    );
    // Mark as read
    const room = await this.chatModel
    .findOne({ roomId })
    .slice('messages', [(page - 1) * limit, limit])
    .populate('messages.sender', 'displayName username');

    return {
      messages: (room?.messages || []).reverse(),
      hasMore: (room?.messages.length || 0) === limit,
    };
  }

  async getChatList(userId: jwtPayload) {
    const rooms = await this.chatModel
      .find({participants: userId.sub})
      .sort({lastMessageAt: -1})
      .select('roomId participants lastMessageAt messages')
      .lean();

    return rooms.map(room => {
      const recipientId = room.participants.find(p => p != userId.sub)
      const lastMsg = room.messages?.[room.messages.length - 1];
      const unreadCount = room.messages?.filter(
        (m: any) => m.sender !== userId && !m.isRead
      ).length || 0;

      return {
        roomId: room.roomId,
        recipientId,
        lastMessage: lastMsg?.content || 'No messages yet',
        lastMessageAt: room.lastMessageAt,
        unreadCount,
      };
    })
  }
}
