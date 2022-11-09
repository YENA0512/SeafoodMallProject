import { Router } from 'express';
import { cartService } from '../services/cart-service';
import { asyncHandler } from '../utils/async-handler';
import cartValidator from '../middlewares/validation/cartValidator';

const cartRouter = Router();

cartRouter.post(
  '/',
  cartValidator.createCart,
  asyncHandler(async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.currentUserId;
    let DTO = { product_id, quantity, user_id };
    const createdCart = await cartService.addCartItem(DTO);
    const result = { success: true, data: createdCart };
    res.status(201).json(result);
  }),
);
cartRouter.post(
  '/login',
  cartValidator.createLoginCart,
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const { cart_items } = req.body;
    const DTO = { cart_items, user_id };
    const userCarts = await cartService.addCartItems(DTO);
    const result = { success: true, data: userCarts };
    res.status(201).json(result);
  }),
);
cartRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const DTO = { user_id };
    const userCarts = await cartService.readAllItems(DTO);
    const result = { success: true, data: userCarts };
    res.status(200).json(result);
  }),
);
cartRouter.delete(
  '/',
  asyncHandler(async (req, res) => {
    const user_id = req.currentUserId;
    const DTO = { user_id };
    await cartService.deleteAll(DTO);
    console.log(4);
    res.status(204);
    res.end();
  }),
);
cartRouter.delete(
  '/some',
  asyncHandler(async (req, res) => {
    const { deleted_ids } = req.body;
    const DTO = { deleted_ids };
    await cartService.deleteSome(DTO);
    res.status(204);
    res.end();
  }),
);
cartRouter.delete(
  '/:_id',
  cartValidator.deleteOneCart,
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const DTO = { _id };
    await cartService.deleteOne(DTO);
    res.status(204);
    res.end();
  }),
);
cartRouter.patch(
  '/:_id',
  cartValidator.updateQuantityCart,
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { quantity } = req.body;
    const DTO = { _id, quantity };
    const updatedCart = await cartService.updateOne(DTO);
    const result = { success: true, data: updatedCart };
    res.status(201).json(result);
  }),
);

export { cartRouter };
