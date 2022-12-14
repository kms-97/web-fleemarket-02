import { CategoryModule } from '@category/category.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from '@location/location.module';
import { UserModule } from '@user/user.module';
import { WishModule } from '@wish/wish.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    forwardRef(() => UserModule),
    LocationModule,
    WishModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
