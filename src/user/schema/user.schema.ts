import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../dto/create-user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.user })
  role: Role;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Post', required: true })
  posts: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
