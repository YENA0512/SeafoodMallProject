import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(DTO) {
    const createdCategory = await Category.create(DTO);
    return createdCategory;
  }

  async readParentList() {
    const parentList = await Category.find({ deleted_at: null }).distinct('parent_category');
    return parentList;
  }

  async readChildList(parent) {
    const filter = { parent_category: parent, deleted_at: null };
    const children = await Category.find(filter).distinct('child_category');
    return children;
  }

  async update(DTO) {
    const filter = { _id: DTO._id, deleted_at: null };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(filter, DTO, option);
    return updatedCategory;
  }

  async delete(DTO) {
    const filter = { _id: DTO._id };
    const deletedAtNow = { deleted_at: new Date() };
    const option = { returnOriginal: false };

    const deletedCategory = await Category.findOneAndUpdate(filter, deletedAtNow, option);
    return deletedCategory;
  }

  async find(additionalFilter) {
    const filter = { deleted_at: null, ...additionalFilter };
    const foundCategory = await Category.find(filter);
    return foundCategory;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
