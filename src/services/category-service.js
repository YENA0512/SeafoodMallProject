import is from '@sindresorhus/is';
import { categoryModel, productModel } from '../db';

class CategoryService {
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  // 카테고리 추가
  async createCategory(DTO) {
    // 카테고리 중복 확인
    const foundCategory = await this.categoryModel.find(DTO);
    if (!is.emptyArray(foundCategory)) {
      throw new Error('중복된 카테고리입니다.');
    }

    const createdCategory = await this.categoryModel.create(DTO);
    return createdCategory;
  }

  // 카테고리 리스트 조회
  async readCategoryList() {
    // 전체 카테고리 조회
    const allCategory = await this.categoryModel.find({});

    // 기능 확장시 사용
    // const setParent = [...new Set(allCategory.map(({ parent_category }) => parent_category))];
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

  // 카테고리 리스트 조회(관리자)
  async readCategoryListAdmin() {
    const allCategory = await this.categoryModel.find({});
    return allCategory;
  }

  // 카테고리 수정
  async updateCategory(DTO) {
    // 카테고리 중복 확인
    const foundCategory = await this.categoryModel.find(DTO);
    if (!is.emptyArray(foundCategory)) {
      throw new Error('중복된 카테고리입니다.');
    }

    // 카테고리 수정, 삭제의 경우 상품 중에 parent, child category가 같은 상품들의 카테고리도 수정해줘야함
    // 1. 먼저 카테고리 수정(returnOriginal : true 라서 원본반환)
    const originalCategory = await this.categoryModel.update(DTO);
    const oldCategory = {
      parent_category: originalCategory.parent_category,
      child_category: originalCategory.child_category,
    };

    // 2. 해당 카테고리들의 상품속 카테고리정보도 수정
    await this.productModel.updateMany(oldCategory, DTO);

    // 바뀐 카테고리 조회(for return)
    const addnitionalFilter = { _id: DTO._id };
    const updatedCategory = await this.categoryModel.find(addnitionalFilter);
    return updatedCategory;
  }

  // 카테고리 삭제
  async deleteCategory(DTO) {
    // 카테고리 삭제
    const deletedCategory = await this.categoryModel.delete(DTO);

    // 해당 카테고리 parent, child에 해당하는 상품들 모두 삭제
    const toDeleteDTO = {
      parent_category: deletedCategory.parent_category,
      child_category: deletedCategory.child_category,
    };

    await this.productModel.deleteMany(toDeleteDTO);
  }

  // 특정 카테고리 조회
  async readCategory(DTO) {
    const additionalFilter = { child_category: DTO.child_category };
    const categoryByChildCategory = await this.categoryModel.find(additionalFilter);
    return categoryByChildCategory;
  }
}

const categoryService = new CategoryService(categoryModel, productModel);

export { categoryService };
