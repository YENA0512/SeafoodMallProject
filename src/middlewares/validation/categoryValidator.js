import { param, body } from 'express-validator';
import { validationErrorChecker } from './validatorErrorChecker';

export const readCategoryByChildCategory = [
  param('child_category').notEmpty().withMessage('child_category parma이 없습니다.'),
  validationErrorChecker,
];

export const createCategory = [
  body('parent_category').notEmpty().withMessage('parent_category가 없습니다'),
  body('child_category').notEmpty().withMessage('child_category가 없습니다'),
  validationErrorChecker,
];

export const updateCategory = [
  body('parent_category').notEmpty().withMessage('parent_category가 없습니다'),
  body('child_category').notEmpty().withMessage('child_category가 없습니다'),
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];

export const deleteCategory = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];
