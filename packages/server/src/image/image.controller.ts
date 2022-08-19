import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  @Post()
  @UseInterceptors(FilesInterceptor('image', 10))
  async uploadImages(@UploadedFiles() files: Express.MulterS3.File[]) {
    return files.reduce((arr, image) => {
      arr.push(image.location);
      return arr;
    }, []);
  }
}
