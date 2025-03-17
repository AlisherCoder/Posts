import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ThemaDocument = HydratedDocument<Thema>;

@Schema({ timestamps: true, versionKey: false })
export class Thema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Post' })
  posts: mongoose.Types.ObjectId[];
}

export const ThemaSchema = SchemaFactory.createForClass(Thema);