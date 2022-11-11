import is from '@sindresorhus/is';
import { categoryModel, productModel } from '../db';

class CategoryService {
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  async createCategory(DTO) {
    const foundCategory = await this.categoryModel.find(DTO);
    if (!is.emptyArray(foundCategory)) {
      throw new Error('중복된 카테고리입니다.');
    }

    const createdCategory = await this.categoryModel.create(DTO);
    return createdCategory;
  }

  async readCategoryList() {
    const allCategory = await this.categoryModel.find({});

    const setParent = ['수산물'];

    const categoryList = [];
    for (const parent of setParent) {
      const childList = [];
      for (const category of allCategory) {
        if (category.parent_category === parent) {
          childList.push(category.child_category);
        }
      }
      categoryList.push({ parent_category: parent, child_category: [...new Set(childList)] });
    }
    return categoryList;
  }

  async readCategoryListAdmin() {
    const allCategory = await this.categoryModel.find({});
    return allCategory;
  }

  async updateCategory(DTO) {
    const foundCategory = await this.categoryModel.find(DTO);
    if (!is.emptyArray(foundCategory)) {
      throw new Error('중복된 카테고리입니다.');
    }

    const originalCategory = await this.categoryModel.update(DTO);
    const oldCategory = {
      parent_category: originalCategory.parent_category,
      child_category: originalCategory.child_category,
    };

    await this.productModel.updateMany(oldCategory, DTO);

    const addnitionalFilter = { _id: DTO._id };
    const updatedCategory = await this.categoryModel.find(addnitionalFilter);
    return updatedCategory;
  }

  async deleteCategory(DTO) {
    const deletedCategory = await this.categoryModel.delete(DTO);

    const toDeleteDTO = {
      parent_category: deletedCategory.parent_category,
      child_category: deletedCategory.child_category,
    };

    await this.productModel.deleteMany(toDeleteDTO);
  }

  async readCategory(DTO) {
    const additionalFilter = { child_category: DTO.child_category };
    const categoryByChildCategory = await this.categoryModel.find(additionalFilter);
    return categoryByChildCategory;
  }
}

const categoryService = new CategoryService(categoryModel, productModel);

export { categoryService };
