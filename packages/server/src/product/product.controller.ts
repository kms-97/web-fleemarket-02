import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { productStatus } from '@src/constant/enum';
import { ProductInsertDto } from './dto/productInsert.dto';
import { ProductSearchDto } from './dto/productSearch.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() dto: ProductSearchDto) {
    return this.productService.findProduct(dto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductDetailById(id);
  }

  @Post()
  async insertProduct(@Body() dto: ProductInsertDto) {
    await this.productService.insertProduct(dto);
  }

  @Post(':id/wish')
  async insertProductWish(@Param('id') productId: number) {
    const userId = 1; // todo: auth를 통해 접속한 유저 아이디 전달받기.
    await this.productService.insertProductWish(userId, productId);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() dto: ProductInsertDto) {
    await this.productService.updateProduct(id, dto);
  }

  @Patch(':id')
  async updateProductStatus(
    @Param('id') id: number,
    @Body('status') newStatus: productStatus,
  ) {
    await this.productService.updateProductStatus(id, newStatus);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id);
  }
}
