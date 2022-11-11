import { param, body, query } from 'express-validator';
import { validationErrorChecker } from './validatorErrorChecker';

export const createProduct = [
  body('category')
    .notEmpty()
    .withMessage('category가 없습니다.')
    .isObject()
    .withMessage('category가 Object 타입이 아닙니다.'),
  body('category.parent_category')
    .notEmpty()
    .withMessage('category.parent_category가 없습니다.')
    .isString()
    .withMessage('category.parent_category가 String 타입이 아닙니다.'),
  body('category.child_category')
    .notEmpty()
    .withMessage('category.child_category가 없습니다.')
    .isString()
    .withMessage('category.child_category가 String 타입이 아닙니다.'),
  body('category.species')
    .notEmpty()
    .withMessage('category.species가 없습니다.')
    .isString()
    .withMessage('category.species가 String 타입이 아닙니다.'),
  body('category.species_code')
    .notEmpty()
    .withMessage('category.species_code가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('category.species_code가 Int 타입이 아닙니다.'),
  body('category.species_image')
    .notEmpty()
    .withMessage('category.species_image가 없습니다.')
    .isString()
    .withMessage('category.species_image가 String 타입이 아닙니다.'),
  body('price')
    .notEmpty()
    .withMessage('category가 없습니다.')
    .isObject()
    .withMessage('category가 Object 타입이 아닙니다.'),
  body('price.auction_cost')
    .notEmpty()
    .withMessage('price.auction_cost가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.auction_cost가 Int 타입이 아닙니다.'),
  body('price.seller_commision')
    .notEmpty()
    .withMessage('price.seller_commision이 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.seller_commision이 Int 타입이 아닙니다.'),
  body('price.platform_commision')
    .notEmpty()
    .withMessage('price.platform_commision이 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.platform_commision이 Int 타입이 아닙니다.'),
  body('price.packaging_cost')
    .notEmpty()
    .withMessage('price.packaging_cost가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.packaging_cost가 Int 타입이 아닙니다.'),
  body('stock').toInt().isInt().withMessage('stock이 Int 타입이 아닙니다.'),
  validationErrorChecker,
];

export const updateProduct = [
  param('_id')
    .notEmpty()
    .withMessage('param에 _id가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongoId 타입이 아닙니다.'),
  body('category')
    .notEmpty()
    .withMessage('category가 없습니다.')
    .isObject()
    .withMessage('category가 Object 타입이 아닙니다.'),
  body('category.parent_category')
    .notEmpty()
    .withMessage('category.parent_category가 없습니다.')
    .isString()
    .withMessage('category.parent_category가 String 타입이 아닙니다.'),
  body('category.child_category')
    .notEmpty()
    .withMessage('category.child_category가 없습니다.')
    .isString()
    .withMessage('category.child_category가 String 타입이 아닙니다.'),
  body('category.species')
    .notEmpty()
    .withMessage('category.species가 없습니다.')
    .isString()
    .withMessage('category.species가 String 타입이 아닙니다.'),
  body('category.species_code')
    .notEmpty()
    .withMessage('category.species_code가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('category.species_code가 Int 타입이 아닙니다.'),
  body('category.species_image')
    .notEmpty()
    .withMessage('category.species_image가 없습니다.')
    .isString()
    .withMessage('category.species_image가 String 타입이 아닙니다.'),
  body('price')
    .notEmpty()
    .withMessage('category가 없습니다.')
    .isObject()
    .withMessage('category가 Object 타입이 아닙니다.'),
  body('price.auction_cost')
    .notEmpty()
    .withMessage('price.auction_cost가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.auction_cost가 Int 타입이 아닙니다.'),
  body('price.seller_commision')
    .notEmpty()
    .withMessage('price.seller_commision이 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.seller_commision이 Int 타입이 아닙니다.'),
  body('price.platform_commision')
    .notEmpty()
    .withMessage('price.platform_commision이 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.platform_commision이 Int 타입이 아닙니다.'),
  body('price.packaging_cost')
    .notEmpty()
    .withMessage('price.packaging_cost가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('price.packaging_cost가 Int 타입이 아닙니다.'),
  body('stock').toInt().isInt().withMessage('stock이 Int 타입이 아닙니다.'),
  validationErrorChecker,
];

export const deleteProduct = [
  param('_id')
    .notEmpty()
    .withMessage('param에 _id가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];

export const readProductByKeyword = [
  query('keyword')
    .notEmpty()
    .withMessage('query에 keyword가 없습니다.')
    .isString()
    .withMessage('keyword가 String 타입이 아닙니다.'),
  validationErrorChecker,
];

export const readProductById = [
  param('_id')
    .notEmpty()
    .withMessage('param에 _id가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];
