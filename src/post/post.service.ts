import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Thema } from 'src/thema/schema/thema.schema';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Thema.name) private themaModel: Model<Thema>,
  ) {}

  async create(createPostDto: CreatePostDto, req: Request) {
    let { themaId } = createPostDto;
    let user = req['user'];
    try {
      let thema = await this.themaModel.findById(themaId);
      if (!thema) {
        return new NotFoundException('Not found thema');
      }

      createPostDto['userId'] = user.id;

      let post = await this.postModel.create(createPostDto);

      await this.userModel.findByIdAndUpdate(post.userId, {
        $push: { posts: post._id },
      });

      await this.themaModel.findByIdAndUpdate(post.themaId, {
        $push: { posts: post._id },
      });

      return { data: post };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(query: any) {
    let { page = 1, limit = 5, ...filter } = query;
    let skip = (page - 1) * limit;
    try {
      let data = await this.postModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate(['userId', 'themaId'])
        .exec();

      if (!data.length) {
        return new NotFoundException('Not found posts');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.postModel.findById(id).populate(['userId', 'themaId']);
      if (!data) {
        return new NotFoundException('Not found post');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto, req: Request) {
    let user = req['user'];
    try {
      let post = await this.postModel.findById(id);
      if (!post) {
        return new NotFoundException('Not found post');
      }

      if (post.userId != user.id) {
        return new ForbiddenException('Not allowed');
      }

      let data = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
        new: true,
      });

      if (updatePostDto.image) {
        let filepath = path.join('uploads', post?.image);
        try {
          fs.unlinkSync(filepath);
        } catch (error) {}
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string, req: Request) {
    let user = req['user'];
    try {
      let post = await this.postModel.findById(id);
      if (!post) {
        return new NotFoundException('Not found post');
      }

      if (post.userId != user.id) {
        return new ForbiddenException('Not allowed');
      }

      let data = await this.postModel.findByIdAndDelete(id);

      let filepath = path.join('uploads', post?.image);
      try {
        fs.unlinkSync(filepath);
      } catch (error) {}

      await this.userModel.findByIdAndUpdate(data?.userId, {
        $pull: { posts: data?._id },
      });

      await this.themaModel.findByIdAndUpdate(data?.themaId, {
        $pull: { posts: data?._id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
