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

  // // 카테고리 리스트 조회
  // async readCategoryList() {
  //   const parentList = await this.categoryModel.readParentList();
  //   const categoryList = [];
  //   for (const parent of parentList) {
  //     const children = await this.categoryModel.readChildList(parent);
  //     categoryList.push({ parent_category: parent, child_category: children });
  //   }
  //   return categoryList;
  // }

  /*
  {
	"success": true,
	"data": [
		{
			"parent_category": "농산물",
			"child_category": [
				"과일",
				"채소"
			]
		},
		{
			"parent_category": "수산물",
			"child_category": [
				"갑각류",
				"생선",
				"조개",
				"조개류"
			]
		}
	]
}
   */
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
    const additionalFilter = { child_category: DTO.child_category };
    const categoryByChildCategory = await this.categoryModel.find(additionalFilter);
    return categoryByChildCategory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
