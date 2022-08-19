import * as path from 'path';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

type MulterReturn = (configService: ConfigService) => MulterOptions;

export const multerOptionsFactory: MulterReturn = (configService) => {
  const s3 = new S3Client({
    region: configService.get('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configService.get('AWS_BUCKET_NAME'),
      key(_req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
