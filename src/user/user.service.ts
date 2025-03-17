import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginPostDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    let { email, password } = createUserDto;

    try {
      let user = await this.userModel.findOne({ email });
      if (user) {
        return new ConflictException('User already exists');
      }

      let hash = bcrypt.hashSync(password, 10);
      let newUser = await this.userModel.create({
        ...createUserDto,
        password: hash,
      });

      return { data: newUser };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async login(createUserDto: LoginPostDto) {
    let { email, password } = createUserDto;

    try {
      let user = await this.userModel.findOne({ email });
      if (!user) {
        return new UnauthorizedException('User is not exists');
      }

      let isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return new BadRequestException('Wrong credentiels');
      }

      let token = this.jwtService.sign({ id: user._id, role: user.role });

      return { data: token };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(query: any) {
    let { page = 1, limit = 5, orderby = 'asc', ...filter } = query;
    let skip = (page - 1) * limit;
    if (filter.name) filter.name = { $regex: filter.name, $options: 'i' };
    if (filter.email) filter.email = { $regex: filter.email, $options: 'i' };

    try {
      let data = await this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort([['name', orderby]])
        .populate('posts')
        .exec();

      if (!data.length) {
        return new NotFoundException('Not found users');
      }

      return { data };
    } catch (error) {
      return new BadGatewayException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.userModel.findById(id).populate('posts').exec();

      if (!data) {
        return new NotFoundException('Not found user');
      }

      return { data };
    } catch (error) {
      return new BadGatewayException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let user = await this.userModel.findById(id);
      if (!user) {
        return new NotFoundException('Not found user');
      }

      let data = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });

      if (updateUserDto.image) {
        let filepath = path.join('uploads', user.image);
        try {
          fs.unlinkSync(filepath);
        } catch (error) {}
      }

      return { data };
    } catch (error) {
      return new BadGatewayException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let data = await this.userModel.findByIdAndDelete(id);

      if (!data) {
        return new NotFoundException('Not found user');
      }

      let filepath = path.join('uploads', data.image);
      try {
        fs.unlinkSync(filepath);
      } catch (error) {}

      return { data };
    } catch (error) {
      return new BadGatewayException(error.message);
    }
  }

  async getMydata(req: Request) {
    let user = req['user'];
    try {
      let data = await this.userModel
        .findById(user.id)
        .populate('posts')
        .exec();

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
