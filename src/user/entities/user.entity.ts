import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, unique: true})
    email: string;
    @Prop({required: true, unique: true})
    username: string;
    @Prop({required: true})
    password: string;
    @Prop({ default: true })
    isActive: boolean;
    @Prop()
    displayName: string;
    @Prop()
    gender: string
    @Prop()
    birthDay: Date;
    @Prop()
    heroscope: string;
    @Prop()
    zodiac: string;
    @Prop()
    height: string;
    @Prop()
    weight: string;
    @Prop({type: [String], default:[]} )
    interest: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);