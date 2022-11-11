import { Router } from 'express';
import { categoryService } from '../services';
import * as categoryValidator from '../middlewares/validation/categoryValidator';
import { loginRequired, isAdmin } from '../middlewares';

const categoryRouter = Router();

categoryRouter.post(
  '/',
  loginRequired,
  isAdmin,
  categoryValidator.createCategory,
  async (req, res, next) => {
    try {
      const { parent_category, child_category } = req.body;
      const DTO = { parent_category, child_category };

      const createdCategory = await categoryService.createCategory(DTO);
      const result = { success: true, data: createdCategory };

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

categoryRouter.get('/list', async (req, res, next) => {
  try {
    const categoryList = await categoryService.readCategoryList();

    const result = { success: true, data: categoryList };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

categoryRouter.get('/list/admin', loginRequired, isAdmin, async (req, res, next) => {
  try {
    const categoryList = await categoryService.readCategoryListAdmin();

    res.status(200).json(categoryList);
  } catch (err) {
    next(err);
  }
});

categoryRouter.patch(
  '/:_id',
  loginRequired,
  isAdmin,
  categoryValidator.updateCategory,
  async (req, res, next) => {
    try {
      const { _id } = req.params;
      const { parent_category, child_category } = req.body;
      const DTO = {
        _id,
        parent_category,
        child_category,
      };

      const updatedCategory = await categoryService.updateCategory(DTO);
      const result = { success: true, data: updatedCategory };

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

categoryRouter.delete(
  '/:_id',
  loginRequired,
  isAdmin,
  categoryValidator.deleteCategory,
  async (req, res, next) => {
    try {
      const { _id } = req.params;
      const DTO = { _id };

      await categoryService.deleteCategory(DTO);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);

categoryRouter.get(
  '/:child_category',
  categoryValidator.readCategoryByChildCategory,
  async (req, res, next) => {
    try {
      const { child_category } = req.params;
      const DTO = { child_category };

      const categoryByChildCategory = await categoryService.readCategory(DTO);
      const result = { success: true, categoryByChildCategory };
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

export { categoryRouter };
