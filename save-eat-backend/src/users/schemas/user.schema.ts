import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  phone: string; // Phone number as the unique identifier

  @Prop({ default: [] })
  preferences: string[]; // Example field to store user preferences
}

export const UserSchema = SchemaFactory.createForClass(User);
