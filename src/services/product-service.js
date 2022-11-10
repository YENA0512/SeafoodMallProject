import { productModel } from '../db';
import { calculateProductCost } from '../utils/calculate-product-cost';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 추가
  async createProduct(DTO) {
    DTO.price.product_cost = Math.round(calculateProductCost(DTO.price) / 10) * 10;
    const createdProduct = await this.productModel.create(DTO);
    return createdProduct;
  }

  // 상품 수정
  async updateProduct(DTO) {
    DTO.price.product_cost = Math.round(calculateProductCost(DTO.price) / 10) * 10;
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

  // 카워드로 상품 검색(부분일치)
  async searchProduct(DTO) {
    const searchKey = 'category.species';
    const { keyword } = DTO;

    const searchedProducts = await this.productModel.searchByKeyword(searchKey, keyword);
    return searchedProducts;
  }

  // 하위 카테고리로 상품 검색(정확히 일치)
  async readProductByCategory(DTO) {
    const searchKey = 'category.child_category';
    const { keyword } = DTO;

    const foundProductsByCategory = await this.productModel.findByKeyword(searchKey, keyword);
    return foundProductsByCategory;
  }

  // id로 상품 검색(정확히 일치)
  async readProductById(DTO) {
    const { _id } = DTO;
    const foundProductById = await this.productModel.findById(_id);
    return foundProductById[0];
  }
}

const productService = new ProductService(productModel);

export { productService };
