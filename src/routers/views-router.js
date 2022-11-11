import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

viewsRouter.use(express.static(path.join(__dirname, '../views/assets')));
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/mypage', serveStatic('mypage'));
viewsRouter.use('/mypage-order', serveStatic('mypage-order'));
viewsRouter.use('/mypage-signout', serveStatic('mypage-signout'));
viewsRouter.use('/categories/category-search?', serveStatic('categories'));
viewsRouter.use('/product/:id', serveStatic('product'));
viewsRouter.use('/cart', serveStatic('cart'));
viewsRouter.use('/cart-login', serveStatic('cart-login'));
viewsRouter.use('/order', serveStatic('order'));

viewsRouter.use(express.static(path.join(__dirname, '../views/admin/assets')));
viewsRouter.use('/admin/home', adminServeStatic('home'));
viewsRouter.use('/admin/categories', adminServeStatic('categories'));
viewsRouter.use('/admin/products', adminServeStatic('products'));
viewsRouter.use('/admin/orders', adminServeStatic('orders'));

viewsRouter.use('/', serveStatic(''));

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

function adminServeStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/admin/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

export { viewsRouter };
