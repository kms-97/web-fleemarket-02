import { Controller, Get, Query } from '@nestjs/common';
import { ProductSearchDto } from './dto/productSearch.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() dto: ProductSearchDto) {
    return this.productService.findProduct(dto);
  }
}
