import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, unique: true })
  roomId: string; // "userA_userB" (sorted)

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: string[];

  @Prop({ type: [{ type: Object }], default: [] })
  messages: {
    sender: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
  }[];

  @Prop({ default: Date.now })
  lastMessageAt: Date;
}

// roomId (unique) → biar lookup room cepat dan nggak duplicate
// participants → buat list semua chat room user
// lastMessageAt → biar daftar chat terurut dari yang terbaru
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ roomId: 1 }, { unique: true });
MessageSchema.index({ participants: 1 });
MessageSchema.index({ lastMessageAt: -1 });