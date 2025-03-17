import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'image.png' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginPostDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export enum Role {
  admin = 'ADMIN',
  user = 'USER',
  superAdmin = 'SUPERADMIN',
}
