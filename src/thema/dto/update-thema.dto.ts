import { PartialType } from '@nestjs/mapped-types';
import { CreateThemaDto } from './create-thema.dto';

export class UpdateThemaDto extends PartialType(CreateThemaDto) {}
