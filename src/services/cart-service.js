import { cartModel } from '../db';

class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }
  async addCartItem(DTO) {
    const createdCart = await this.cartModel.create(DTO);
    return createdCart;
  }
  async addCartItems(DTO) {
    const { cart_items, user_id } = DTO;
    const created_items = [];
    for (const item of cart_items) {
      const { product_id, quantity } = item;
      const product = await this.productModel.readProduct(product_id);
      const createdItem = await this.cartModel.createByEl(product, quantity, user_id);
      created_items.push(createdItem);
    }
    return created_items;
  }
  async readAllItems(DTO) {
    const allItems = await this.cartModel.readAll(DTO);
    return allItems;
  }
  async deleteAll(DTO) {
    await this.cartModel.deleteAll(DTO);
    return;
  }
  async deleteOne(DTO) {
    const deletedCart = await this.cartModel.delete(DTO);
    return deletedCart;
  }
  async deleteSome(DTO) {
    const { deleted_ids } = DTO;
    const deletedItems = [];
    for (const _id of deleted_ids) {
      const deleted_item = await this.cartModel.delete(_id);
      deletedItems.push(deleted_item);
    }
    return deletedItems;
  }
  async updateOne(DTO) {
    const updatedCart = this.cartModel.update(DTO);
    return updatedCart;
  }
}

const cartService = new CartService(cartModel);
export { cartService };
