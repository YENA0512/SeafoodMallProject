import { model } from 'mongoose';
import { CartSchema } from '../schemas/cart-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async create(DTO) {
    const createdCart = await Cart.create(DTO);
    return createdCart;
  }
  async createByEl(product, quantity, user_id) {
    const createdCart = await Cart.create(product, quantity, user_id);
    return createdCart;
  }
  async readAll(DTO) {
    const { user_id } = DTO;
    const allCarts = await Cart.find({ user_id });
    return allCarts;
  }
  async deleteAll(DTO) {
    const { user_id } = DTO;
    const updated = { deleted_at: new Date() };
    const option = { returnOriginal: false };
    const deletedCarts = await Cart.updateMany({ user_id }, updated, option);
    return deletedCarts;
  }
  async delete(DTO) {
    const { _id } = DTO;
    const updated = { deleted_at: new Date() };
    const option = { returnOriginal: false };
    const deletedCart = await Cart.findOneAndUpdate({ _id }, updated, option);
    return deletedCart;
  }
  async update(DTO) {
    const { _id, quantity } = DTO;
    const updated = { quantity };
    const option = { returnOriginal: false };
    const updatedCart = await Cart.findOneAndUpdate({ _id }, updated, option);
    return updatedCart;
  }
}

const cartModel = new CartModel();
export { cartModel };
