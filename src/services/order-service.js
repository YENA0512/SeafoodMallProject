import { orderModel } from '../db';
import { cartModel } from '../db';

class OrderService {
  constructor(orderModel, cartModel) {
    this.orderModel = orderModel;
    this.cartModel = cartModel;
  }
  async createOrder(DTO) {
    const { order_items } = DTO;
    const deletedCartIds = [];
    const order_price = order_items.reduce((sum, { _id, cart_price }) => {
      deletedCartIds.push(_id);
      return (sum += cart_price);
    }, 0);
    DTO.order_price = order_price + parseInt(process.env.SHIPPING_COST);
    const [createdOrder, _] = await Promise.all([
      this.orderModel.create(DTO),
      this.cartModel.deleteMany({ deleted_ids: deletedCartIds }),
    ]);
    return createdOrder;
  }
  async getUserOrders(DTO) {
    const orders = await this.orderModel.readUserOrders(DTO);
    return orders;
  }
  async getAllOrders() {
    const orders = await this.orderModel.readAllOrders();
    return orders;
  }
  async updateStatus(DTO) {
    const order = await this.orderModel.updateOrderStatus(DTO);
    return order;
  }
  async updateOrderShipping(DTO) {
    const order = await this.orderModel.updateShipping(DTO);
    return order;
  }
  async cancelOrder(DTO) {
    const canceledOrder = await this.orderModel.cancel(DTO);
    return canceledOrder;
  }
  async deleteOrder(DTO) {
    await this.orderModel.delete(DTO);
    return;
  }
}

const orderService = new OrderService(orderModel, cartModel);
export { orderService };
