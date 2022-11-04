import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(DTO) {
    const createdCategory = await Category.create(DTO);
    return createdCategory;
  }

  async readList() {
    const parentList = await Category.find().distinct('parent_category');
    const categoryList = [];
    for (const parent of parentList) {
      const children = await Category.find({ parent_category: parent }).distinct('child_category');
      categoryList.push({ parent_category: parent, child_category: children });
    }
    return categoryList;
  }

  async update(DTO) {
    const filter = { _id: DTO._id };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(filter, DTO, option);
    return updatedCategory;
  }

  async delete(DTO) {
    const filter = { _id: DTO };
    const deletedAtNow = { deleted_at: new Date() };
    const option = { returnOriginal: false };

    const deletedCategory = await Category.findOneAndUpdate(filter, deletedAtNow, option);
    return deletedCategory;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
