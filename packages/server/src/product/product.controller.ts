import {
  Body,
  Controller,
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
    return this.productService.getProductById(id);
  }

  @Post()
  async insertProduct(@Body() dto: ProductInsertDto) {
    await this.productService.insertProduct(dto);
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
}
