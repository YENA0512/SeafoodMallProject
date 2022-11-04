import { categoryModel } from '../db';

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 추가
  async createCategory(DTO) {
    const createdCategory = await this.categoryModel.create(DTO);
    return createdCategory;
  }

  // 카테고리 리스트 조회
  async readCategoryList() {
    const categoryList = await this.categoryModel.readList();
    return categoryList;
  }

  // 카테고리 수정
  async updateCategory(DTO) {
    const updatedCategory = await this.categoryModel.update(DTO);
    return updatedCategory;
  }

  // 카테고리 삭제
  async deleteCategory(DTO) {
    const deletedCagtegory = await this.categoryModel.delete(DTO);
    return deletedCagtegory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
