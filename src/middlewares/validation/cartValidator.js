import { param, body } from 'express-validator';
import { validationErrorChecker } from './validatorErrorChecker';

exports.createCart = [
  body('product_id')
    .notEmpty()
    .withMessage('product_id가 없습니다.')
    .isMongoId()
    .withMessage('product_id가 MongoId 타입이 아닙니다.'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('quantity가 Int 타입이 아닙니다.'),
  validationErrorChecker,
];

exports.createLoginCart = [
  body('cart_items')
    .notEmpty()
    .withMessage('cart_items가 없습니다.')
    .isArray()
    .withMessage('cart_items가 Array 타입이 아닙니다.'),
  body('cart_items.*.product_id')
    .notEmpty()
    .withMessage('cart_items에 product_id가 없는 데이터가 있습니다.')
    .isMongoId()
    .withMessage('product_id가 MongoId 타입이 아닙니다.'),
  body('cart_items.*.quantity')
    .notEmpty()
    .withMessage('cart_items에 quantity가 없는 데이터가 있습니다.')
    .toInt()
    .isInt()
    .withMessage('quantity가 Int 타입이 아닙니다.'),
  validationErrorChecker,
];

exports.deleteOneCart = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];

exports.updateQuantityCart = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongoId 타입이 아닙니다.'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('quantity가 Int 타입이 아닙니다.'),
  validationErrorChecker,
];
