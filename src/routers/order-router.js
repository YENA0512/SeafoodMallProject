import { Router } from 'express';
import { orderService } from '../services/order-service';
import { userService } from '../services/user-service';
import { asyncHandler } from '../utils/async-handler';
import { sanitizeObject } from '../utils/sanitizeObject';

const orderRouter = Router();

orderRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const customer = await userService.getUser(user_id);
    const { order_items } = req.body;
    const DTO = { order_items, customer };
    const createdOrder = await orderService.createOrder(DTO);
    const result = { success: true, data: createdOrder };
    res.status(201).json(result);
  }),
);
orderRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const DTO = { user_id };
    const orders = await orderService.getUserOrders(DTO);
    const result = { success: true, data: orders };
    res.status(200).json(result);
  }),
);

orderRouter.get(
  '/admin',
  asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrders();
    const result = { success: true, data: orders };
    res.status(200).json(result);
  }),
);
orderRouter.patch(
  '/status',
  asyncHandler(async (req, res) => {
    const { _id, order_status } = req.body;
    const DTO = { _id, order_status };
    const updatedOrder = await orderService.updateStatus(DTO);
    const result = { success: true, data: updatedOrder };
    res.status(201).json(result);
  }),
);
orderRouter.patch(
  '/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { shipping } = req.body;
    const DTO = { _id, shipping };
    const updatedOrder = await orderService.updateOrderShipping(DTO);
    const result = { success: true, data: updatedOrder };
    res.status(201).json(result);
  }),
);
orderRouter.delete(
  '/admin/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const DTO = { _id };
    await orderService.deleteOrder(DTO);
    res.status(204);
    res.end();
  }),
);
orderRouter.delete(
  '/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const DTO = { _id };
    const canceledOrder = await orderService.cancelOrder(DTO);
    const result = { success: true, data: canceledOrder };
    res.status(201).json(result);
  }),
);

export { orderRouter };
