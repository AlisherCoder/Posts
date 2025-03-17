import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'post.img' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ example: 'Web Programming' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Web programming is the best' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: '67d805a28ee5ba669a4727a0' })
  @IsNotEmpty()
  @IsMongoId()
  themaId: string;
}

