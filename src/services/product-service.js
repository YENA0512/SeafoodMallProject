import { productModel } from '../db';
import { calculateProductCost } from '../utils/calculate-product-cost';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async createProduct(DTO) {
    DTO.price.product_cost = Math.round(calculateProductCost(DTO.price) / 10) * 10;
    const createdProduct = await this.productModel.create(DTO);
    return createdProduct;
  }

  async updateProduct(DTO) {
    DTO.price.product_cost = Math.round(calculateProductCost(DTO.price) / 10) * 10;
    const updatedProduct = await this.productModel.update(DTO);
    return updatedProduct;
  }

  async readProductList() {
    const productList = await this.productModel.find();
    return productList;
  }

  async deleteProduct(DTO) {
    const deletedProduct = await this.productModel.delete(DTO);
    return deletedProduct;
  }

  async searchProduct(DTO) {
    const searchKey = 'category.species';
    const { keyword } = DTO;

    const searchedProducts = await this.productModel.searchByKeyword(searchKey, keyword);
    return searchedProducts;
  }

  async readProductByCategory(DTO) {
    const searchKey = 'category.child_category';
    const { keyword } = DTO;

    const foundProductsByCategory = await this.productModel.findByKeyword(searchKey, keyword);
    return foundProductsByCategory;
  }

  async readProductById(DTO) {
    const { _id } = DTO;
    const foundProductById = await this.productModel.findById(_id);
    return foundProductById[0];
  }
}

const productService = new ProductService(productModel);

export { productService };
