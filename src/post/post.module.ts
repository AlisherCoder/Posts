import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Thema, ThemaSchema } from 'src/thema/schema/thema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Thema.name, schema: ThemaSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
