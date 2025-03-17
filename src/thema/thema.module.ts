import { Module } from '@nestjs/common';
import { ThemaService } from './thema.service';
import { ThemaController } from './thema.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Thema, ThemaSchema } from './schema/thema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thema.name, schema: ThemaSchema }]),
  ],
  controllers: [ThemaController],
  providers: [ThemaService],
})
export class ThemaModule {}
