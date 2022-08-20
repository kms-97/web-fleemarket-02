import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, CategoryRepository } from './entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getCategories() {
    const categories = await this.categoryRepository.query(
      `select id, name, imgUrl from Category`,
    );

    return { categories };
  }

  async getCategoryByName(name: string) {
    const [category] = await this.categoryRepository.query(
      `select * from Category where name = ?`,
      [name],
    );

    return { category: category ?? null };
  }
}
