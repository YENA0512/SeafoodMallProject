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
    const parentList = await this.categoryModel.readParentList();
    const categoryList = [];
    for (const parent of parentList) {
      const children = await this.categoryModel.readChildList(parent);
      categoryList.push({ parent_category: parent, child_category: children });
    }
    return categoryList;
  }

  // 카테고리 수정
  async updateCategory(DTO) {
    const updatedCategory = await this.categoryModel.update(DTO);
    return updatedCategory;
  }

  // 카테고리 삭제
  async deleteCategory(DTO) {
    const deletedCategory = await this.categoryModel.delete(DTO);
    return deletedCategory;
  }

  // 특정 카테고리 조회
  async readCategory(DTO) {
    const categoryByChildCategory = await this.categoryModel.readCategory(DTO);
    return categoryByChildCategory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
