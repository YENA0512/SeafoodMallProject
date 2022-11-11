import { Router } from 'express';
import { productService } from '../services/product-service';
import { objectConversionStr2Num } from '../utils/object-conversion';
import * as productValidatior from '../middlewares/validation/productValidator';
import { loginRequired, isAdmin } from '../middlewares';

const productRouter = Router();

// 상품 추가
productRouter.post(
  '/',
  loginRequired,
  isAdmin,
  productValidatior.createProduct,
  async (req, res, next) => {
    try {
      const { category, price, stock } = req.body;
      const DTO = { category, price: objectConversionStr2Num(price), stock: parseInt(stock) };

      const createdProduct = await productService.createProduct(DTO);
      const result = { success: true, data: createdProduct };

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 상품 수정
productRouter.patch(
  '/:_id',
  loginRequired,
  isAdmin,
  productValidatior.updateProduct,
  async (req, res, next) => {
    try {
      const { _id } = req.params;

      const { category, price, stock } = req.body;
      const DTO = { category, price: objectConversionStr2Num(price), stock: parseInt(stock), _id };

      const updatedProduct = await productService.updateProduct(DTO);
      const result = { success: true, data: updatedProduct };

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 상품 조회(전체) TODO : pagination
productRouter.get('/list', async (req, res, next) => {
  try {
    const productList = await productService.readProductList();

    const result = { success: true, data: productList };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 상품 삭제
productRouter.delete(
  '/:_id',
  loginRequired,
  isAdmin,
  productValidatior.deleteProduct,
  async (req, res, next) => {
    try {
      const { _id } = req.params;
      const DTO = { _id };

      await productService.deleteProduct(DTO);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);

// 상품명으로 검색
productRouter.get('/search', productValidatior.readProductByKeyword, async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const DTO = { keyword };

    const searchedProducts = await productService.searchProduct(DTO);

    const result = { success: true, data: searchedProducts };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 하위카테고리로 검색
productRouter.get(
  '/category-search',
  productValidatior.readProductByKeyword,
  async (req, res, next) => {
    try {
      const { keyword } = req.query;
      const DTO = { keyword };

      const seachedProductsByCategory = await productService.readProductByCategory(DTO);

      res.status(200).json(seachedProductsByCategory);
    } catch (err) {
      next(err);
    }
  },
);

productRouter.get('/:_id', productValidatior.readProductById, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const DTO = { _id };

    const foundProductById = await productService.readProductById(DTO);
    res.status(200).json(foundProductById);
  } catch (err) {
    next(err);
  }
});
export { productRouter };
