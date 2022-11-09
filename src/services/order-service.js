import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }
  async createOrder(DTO) {
    const { order_items } = DTO;
    const order_price = order_items.reduce((sum, { cart_price }) => {
      return (sum += cart_price);
    }, 0);
    DTO.order_price = order_price + process.env.SHIPPING_COST;
    const createdOrder = await this.orderModel.create(DTO);
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

const orderService = new OrderService(orderModel);
export { orderService };
