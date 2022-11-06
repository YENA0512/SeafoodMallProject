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
    console.log(productList);
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

  // 상품검색
  async findByKeyword(DTO) {
    const filter = {
      'category.species': new RegExp(DTO.keyword),
      deleted_at: null,
    };

    const searchedProducts = await Product.find(filter);
    return searchedProducts;
  }
}

const productModel = new ProductModel();

export { productModel };
