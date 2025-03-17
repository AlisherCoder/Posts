import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          let name = `${Date.now()}${path.extname(file.originalname)}`;
          callback(null, name);
        },
      }),
      limits: {
        fileSize: 10 * 1024 ** 2,
      },
    }),
  )
  uploadFile(@UploadedFile() file) {
    return { data: file.filename };
  }
}
