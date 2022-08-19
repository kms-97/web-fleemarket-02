import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from '@category/category.module';
import { DatabaseModule } from '@database/database.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    CategoryModule,
    LocationModule,
  ],
})
export class AppModule {}
