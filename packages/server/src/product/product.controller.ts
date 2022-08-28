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
  UseGuards,
} from '@nestjs/common';
import { productStatus } from '@constant/enum';
import { ProductInsertDto } from './dto/productInsert.dto';
import { ProductSearchDto } from './dto/productSearch.dto';
import { ProductService } from './product.service';
import { AccessJwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { User, TokenUser } from '@decorator/user.decorator';

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

  @UseGuards(AccessJwtAuthGuard)
  @Post()
  async insertProduct(@Body() dto: ProductInsertDto) {
    await this.productService.insertProduct(dto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/wish')
  async insertProductWish(
    @User() user: TokenUser,
    @Param('id') productId: number,
  ) {
    const userId = user.id;
    await this.productService.insertProductWish(userId, productId);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Put(':id')
  async updateProduct(
    @User() user: TokenUser,
    @Param('id') id: number,
    @Body() dto: ProductInsertDto,
  ) {
    const userId = user.id;
    await this.productService.updateProduct(userId, id, dto);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':id')
  async updateProductStatus(
    @User() user: TokenUser,
    @Param('id') id: number,
    @Body('status') newStatus: productStatus,
  ) {
    const userId = user.id;
    await this.productService.updateProductStatus(userId, id, newStatus);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@User() user: TokenUser, @Param('id') id: number) {
    const userId = user.id;
    await this.productService.deleteProduct(userId, id);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete(':id/wish')
  async deleteProductWish(
    @User() user: TokenUser,
    @Param('id') productId: number,
  ) {
    const userId = user.id;
    await this.productService.deleteProductWish(userId, productId);
  }
}
