import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  providers: [CommonService],
})
export class CommonModule {}
