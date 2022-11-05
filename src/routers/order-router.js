import { Router } from 'express';
import { orderService } from '../services/order-service';
import { userService } from '../services/ex-user-service';
import { asyncHandler } from '../utils/async-handler';
import { loginRequired } from '../middlewares';
import { sanitizeObject } from '../utils/sanitizeObject';
import is from '@sindresorhus/is';

const orderRouter = Router();

orderRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { order_items } = req.body;
    const user_id = req.currentUserId;
    const customer = await userService.getUser(user_id).populate('shippings');
    if (is.emptyObject(customer.shipping)) {
      throw new Error('유저의 배송지 정보가 필요합니다.');
    }
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
    res.status(201).json(result);
  }),
);

orderRouter.get(
  '/admin',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const user = await userService.getUser(user_id);
    if (!user.group === 'admin') {
      throw new Error('관리자만 접근할 수 있습니다.');
    }
    const orders = await orderService.getAllOrders();
    const result = { success: true, data: orders };
    res.status(201).json(result);
  }),
);
orderRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { order_items, customer, order_status } = req.body;
    const DTO = sanitizeObject({
      _id,
      order_items,
      customer,
      order_status,
    });
    const updatedOrder = await orderService.updateOrder(DTO);
    const result = { success: true, data: updatedOrder };
    res.status(201).json(result);
  }),
);
orderRouter.patch(
  '/admin',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const user = await userService.getUser(user_id);
    if (!user.group === 'admin') {
      throw new Error('관리자만 접근할 수 있습니다.');
    }
    const { _id, order_status } = req.body;
    const DTO = { _id, order_status };
    const updatedOrder = await orderService.updateStatus(DTO);
    const result = { success: true, data: updatedOrder };
    res.status(201).json(result);
  }),
);
orderRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const DTO = { _id };
    const canceledOrder = await orderService.cancelOrder(DTO);
    const result = { success: true, data: canceledOrder };
    res.status(201).json(result);
  }),
);
orderRouter.delete(
  '/:_id/admin',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const DTO = { _id };
    await orderService.deleteOrder(DTO);
    const result = { success: true };
    res.status(201).json(result);
  }),
);

export { orderRouter };
