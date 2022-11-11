import express from 'express';
import { cartRouter } from './cart-router';
import { categoryRouter } from './category-router';
import { userRouter } from './user-router';
import { orderRouter } from './order-router';
import { productRouter } from './product-router';
import { healthRouter } from './health-router';

import { loginRequired } from '../middlewares';

const v1Router = express.Router();

v1Router.use('/categories', categoryRouter);
v1Router.use('/users', userRouter);
v1Router.use('/products', productRouter);
v1Router.use('/carts', loginRequired, cartRouter);
v1Router.use('/orders', loginRequired, orderRouter);
v1Router.use('/health', healthRouter);

export * from './views-router';
export { v1Router };
