// import { Router } from 'mongoose';
// import { cartService } from '../services/cart-service';
// import { asyncHandler } from '../utils/async-handler';

// const cartRouter = Router();

// cartRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const { product_id, quantity } = req.body;
//     const user_id = req.currentUserId;
//     let DTO = { product_id, quantity, user_id };
//     const createdCart = await cartService.addCartItem(DTO);
//     const result = { success: true, data: createdCart };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.post(
//   '/login',
//   asyncHandler(async (req, res) => {
//     const user_id = req.currentUserId;
//     const { cart_items } = req.body;
//     const DTO = { cart_items, user_id };
//     const userCarts = await cartService.addCartItems(DTO);
//     const result = { success: true, data: userCarts };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const user_id = req.currentUserId;
//     const DTO = { user_id };
//     const userCarts = await cartService.readAllItems(DTO);
//     const result = { success: true, data: userCarts };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.delete(
//   '/',
//   asyncHandler(async (req, res) => {
//     const user_id = req.currentUserId;
//     const DTO = { user_id };
//     await cartService.deleteAll(DTO);
//     const result = { success: true };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.delete(
//   '/:_id',
//   asyncHandler(async (req, res) => {
//     const { _id } = req.params;
//     const DTO = { _id };
//     const deletedCart = await cartService.deleteOne(DTO);
//     const result = { success: true, data: deletedCart };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.delete(
//   '/some',
//   asyncHandler(async (req, res) => {
//     const { deleted_ids } = req.body;
//     const DTO = { deleted_ids };
//     const deletedCarts = await cartService.deleteSome(DTO);
//     const result = { success: true, data: deletedCarts };
//     res.status(201).json(result);
//   }),
// );
// cartRouter.patch(
//   '/:_id',
//   asyncHandler(async (req, res) => {
//     const { _id } = req.params;
//     const { quantity } = req.body;
//     const DTO = { _id, quantity };
//     const updatedCart = await cartService.updateOne(DTO);
//     const result = { success: true, data: updatedCart };
//     res.status(201).json(result);
//   }),
// );

// export { cartRouter };
