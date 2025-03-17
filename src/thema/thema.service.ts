import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateThemaDto } from './dto/create-thema.dto';
import { UpdateThemaDto } from './dto/update-thema.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thema } from './schema/thema.schema';
import { Model } from 'mongoose';

@Injectable()
export class ThemaService {
  constructor(@InjectModel(Thema.name) private themaModel: Model<Thema>) {}

  async create(createThemaDto: CreateThemaDto) {
    try {
      let data = await this.themaModel.create(createThemaDto);
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(query: any) {
    let { page = 1, limit = 5, orderby = 'asc', ...filter } = query;
    let skip = (page - 1) * limit;
    if (filter.name) filter.name = { $regex: filter.name, $options: 'i' };

    try {
      let data = await this.themaModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort([['name', orderby]])
        .populate('posts')
        .exec();

      if (!data.length) {
        return new NotFoundException('Not found thema');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.themaModel.findById(id).populate('posts').exec();
      if (!data) {
        return new NotFoundException('Not found thema');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateThemaDto: UpdateThemaDto) {
    try {
      let data = await this.themaModel.findByIdAndUpdate(id, updateThemaDto, {
        new: true,
      });

      if (!data) {
        return new NotFoundException('Not found thema');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let data = await this.themaModel.findByIdAndDelete(id);
      if (!data) {
        return new NotFoundException('Not found thema');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
