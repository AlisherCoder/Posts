import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ThemaService } from './thema.service';
import { CreateThemaDto } from './dto/create-thema.dto';
import { UpdateThemaDto } from './dto/update-thema.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/dto/create-user.dto';
import { RoleGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('thema')
export class ThemaController {
  constructor(private readonly themaService: ThemaService) {}

  @Roles(Role.admin)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createThemaDto: CreateThemaDto) {
    return this.themaService.create(createThemaDto);
  }

  @ApiQuery({ name: 'order', required: false, type: String, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Get()
  findAll(@Query() query: any) {
    return this.themaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.themaService.findOne(id);
  }

  @Roles(Role.admin, Role.superAdmin)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThemaDto: UpdateThemaDto) {
    return this.themaService.update(id, updateThemaDto);
  }

  @Roles(Role.admin)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.themaService.remove(id);
  }
}
