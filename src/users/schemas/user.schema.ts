import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) username: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) phonenumber: string;
  @Prop() image?: string;
  @Prop({ default: 'user', enum: ['admin', 'user'] }) role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);
