import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  // 상품 추가
  async create(DTO) {
    const createdProduct = await Product.create(DTO);
    return createdProduct;
  }

  // 상품 수정
  async update(DTO) {
    const filter = { _id: DTO._id, deleted_at: null };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filter, DTO, option);
    return updatedProduct;
  }

  // 상품 조회
  async find() {
    const filter = { deleted_at: null };
    const productList = await Product.find(filter);

    return productList;
  }

  // 상품 삭제
  async delete(DTO) {
    const filter = { _id: DTO._id };
    const deletedAtNow = { deleted_at: new Date() };
    const option = { returnOriginal: false };

    const deletedProduct = await Product.findOneAndUpdate(filter, deletedAtNow, option);
    return deletedProduct;
  }

  // 상품검색(부분일치)
  async searchByKeyword(searchKey, keyword) {
    const filter = {
      [searchKey]: new RegExp(keyword),
      deleted_at: null,
    };

    const foundProductsByKeyword = await Product.find(filter);
    return foundProductsByKeyword;
  }

  //카테고리 검색(정확히 일치)
  async findByKeyword(searchKey, keyword) {
    const filter = {
      [searchKey]: keyword,
      deleted_at: null,
    };

    const foundProductsByKeyword = await Product.find(filter);
    return foundProductsByKeyword;
  }

  // id로 조회
  async findById(_id) {
    const filter = { _id: _id, deleted_at: null };
    const foundProduct = await Product.find(filter);
    return foundProduct;
  }
}

const productModel = new ProductModel();

export { productModel };
