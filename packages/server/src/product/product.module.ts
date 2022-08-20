import { CategoryModule } from '@category/category.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from '@src/location/location.module';
import { UserModule } from '@src/user/user.module';
import { WishModule } from '@src/wish/wish.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    UserModule,
    LocationModule,
    WishModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
