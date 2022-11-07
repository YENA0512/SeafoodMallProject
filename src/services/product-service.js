import { productModel } from '../db';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 추가
  async createProduct(DTO) {
    const createdProduct = await this.productModel.create(DTO);
    return createdProduct;
  }

  // 상품 수정
  async updateProduct(DTO) {
    const updatedProduct = await this.productModel.update(DTO);
    return updatedProduct;
  }

  // 전체 상품 조회
  async readProductList() {
    const productList = await this.productModel.find();
    return productList;
  }

  // 상품 삭제
  async deleteProduct(DTO) {
    const deletedProduct = await this.productModel.delete(DTO);
    return deletedProduct;
  }

  // 상품 검색
  async searchProduct(DTO) {
    const searchedProducts = await this.productModel.findByKeyword(DTO);
    return searchedProducts;
  }
}

const productService = new ProductService(productModel);

export { productService };
