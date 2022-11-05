// 이 routers 폴더에서 만들어진 모듈들을 깔끔하게 묶어주는 역할을 index.js가 함.
// 나중에 import 할 때의 코드도 짧아지는 효과가 있음.
import express from 'express';
import { cartRouter } from './cart-router';
import { categoryRouter } from './category-router';
import { orderRouter } from './order-router';
const v1Router = express.Router();

v1Router.use('/categories', categoryRouter);
v1Router.use('/orders', orderRouter);
v1Router.use('/carts', cartRouter);

export * from './views-router';
export { v1Router };
// export * from './user-router';
// export * from './category-router';
