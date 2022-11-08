import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async create(DTO) {
    const createdOrder = await Order.create(DTO);
    return createdOrder;
  }
  async readUserOrders(DTO) {
    const { user_id } = DTO;
    const orders = await Order.find({ 'customer._id': user_id, deleted_at: null }).populate({
      path: 'order_items',
      populate: {
        path: 'product_id',
        model: 'products',
      },
    });
    return orders;
  }
  async readAllOrders() {
    const orders = await Order.find({ deleted_at: null }).populate({
      path: 'order_items',
      populate: {
        path: 'product_id',
        model: 'products',
      },
    });
    return orders;
  }
  async updateShipping(DTO) {
    const { _id, shipping } = DTO;
    console.log(shipping);
    const updatedOrder = await Order.findOneAndUpdate(
      { _id },
      { 'customer.shipping': shipping },
      { returnOriginal: false },
    );
    console.log(updatedOrder);
    return updatedOrder;
  }
  async updateOrderStatus(DTO) {
    const { _id, order_status } = DTO;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id },
      { order_status },
      { returnOriginal: false },
    );
    return updatedOrder;
  }
  async cancel(DTO) {
    const { _id } = DTO;
    const updated = { order_status: 'cancel' };
    const option = { returnOriginal: false };
    const canceledOrder = await Order.findOneAndUpdate({ _id }, updated, option);
    return canceledOrder;
  }
  async delete(DTO) {
    const { _id } = DTO;
    const deletedAtNow = { deleted_at: new Date() };
    const option = { returnOriginal: false };
    await Order.findOneAndUpdate({ _id }, deletedAtNow, option);
    return;
  }
}

const orderModel = new OrderModel();
export { orderModel };
