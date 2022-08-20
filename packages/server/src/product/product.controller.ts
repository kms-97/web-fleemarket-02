import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Post()
  async insertProduct(@Body() dto: ProductInsertDto) {
    await this.productService.insertProduct(dto);
  }
}
