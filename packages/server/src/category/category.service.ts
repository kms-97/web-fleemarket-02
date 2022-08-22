import { CATEGORY_QUERY } from '@constant/queries';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from '@base/CustomException';
import { ErrorMessage } from '@constant/ErrorMessage';
import { Category, CategoryRepository } from './entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getCategories() {
    const categories = await this.categoryRepository.query(
      CATEGORY_QUERY.GET_CATEGORIES,
    );

    return { categories };
  }

  async getCategoryByName(name: string) {
    const [category] = await this.categoryRepository.query(
      CATEGORY_QUERY.GET_CATEGORY_BY_NAME,
      [name],
    );

    return { category: category ?? null };
  }

  async getCategoryById(id: number) {
    const [category] = await this.categoryRepository.query(
      CATEGORY_QUERY.GET_CATEGORY_BY_ID,
      [id],
    );

    return { category: category ?? null };
  }

  async checkExistCategoryByName(name: string) {
    const { category } = await this.getCategoryByName(name);
    if (!category) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('카테고리')],
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async checkExistCategoryById(id: number) {
    const { category } = await this.getCategoryById(id);
    if (!category) {
      throw new CustomException(
        [ErrorMessage.NOT_FOUND_TARGET('카테고리')],
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
