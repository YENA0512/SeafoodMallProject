// 이 routers 폴더에서 만들어진 모듈들을 깔끔하게 묶어주는 역할을 index.js가 함.
// 나중에 import 할 때의 코드도 짧아지는 효과가 있음.
import express from 'express';
import { cartRouter } from './cart-router';
import { categoryRouter } from './category-router';
import { userRouter } from './user-router';
import { orderRouter } from './order-router';
import { productRouter } from './product-router';

import { loginRequired } from '../middlewares';

const v1Router = express.Router();

v1Router.use('/categories', categoryRouter);
v1Router.use('/users', userRouter);
v1Router.use('/products', productRouter);
v1Router.use('/carts', loginRequired, cartRouter);
v1Router.use('/orders', loginRequired, orderRouter);

export * from './views-router';
export { v1Router };
