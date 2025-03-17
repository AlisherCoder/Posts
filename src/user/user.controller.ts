import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginPostDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { SelfGuard } from 'src/auth/self.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: LoginPostDto) {
    return this.userService.login(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('mydata')
  getMydata(@Req() req: Request) {
    return this.userService.getMydata(req);
  }

  @ApiQuery({ name: 'order', required: false, type: String, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @Roles(Role.admin)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
