import { model } from 'mongoose';
import { CartSchema } from '../schemas/cart-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async create(DTO) {
    const createdCart = await Cart.create(DTO);
    return createdCart;
  }
  async insertMany(DTO) {
    const createdBulkCart = await Cart.insertMany(DTO);
    return createdBulkCart;
  }
  async read(DTO) {
    const { _id } = DTO;
    const cart = await Cart.findOne({ _id }).populate('user_id').populate('product_id');
    return cart;
  }
  async readAll(DTO) {
    const { user_id } = DTO;
    const allCarts = await Cart.find({ user_id, deleted_at: null })
      .populate('user_id')
      .populate('product_id');
    return allCarts;
  }
  async readCartByProduct(DTO) {
    const { user_id, product_id } = DTO;
    const productCart = await Cart.findOne({ user_id, product_id, deleted_at: null })
      .populate('user_id')
      .populate('product_id');
    return productCart;
  }
  async deleteAll(DTO) {
    const { user_id } = DTO;
    const updated = { deleted_at: new Date() };
    await Cart.updateMany({ user_id, deleted_at: null }, updated);
    return;
  }
  async delete(DTO) {
    const { _id } = DTO;
    const updated = { deleted_at: new Date() };
    const option = { returnOriginal: false };
    await Cart.findOneAndUpdate({ _id }, updated, option);
    return;
  }
  async deleteMany(DTO) {
    const { deleted_ids } = DTO;
    const updated = { deleted_at: new Date() };
    await Cart.updateMany({ _id: { $in: deleted_ids } }, updated);
    return;
  }
  async update(DTO) {
    const { _id, quantity, cart_price } = DTO;
    const updated = { quantity, cart_price };
    const option = { returnOriginal: false };
    const updatedCart = await Cart.findOneAndUpdate({ _id }, updated, option);
    return updatedCart;
  }
}

const cartModel = new CartModel();
export { cartModel };
