import { param, body } from 'express-validator';
import { validationErrorChecker } from './validatorErrorChecker';

exports.createOrder = [
  body('order_items')
    .notEmpty()
    .withMessage('order_items가 없습니다.')
    .isArray()
    .withMessage('order_items가 Array 타입이 아닙니다.'),
  body('order_items.*._id')
    .notEmpty()
    .withMessage('order_items에 _id가 없는 데이터가 있습니다.')
    .isMongoId()
    .withMessage('_id가 MongoId 타입이 아닙니다.'),
  body('order_items.*.user_id')
    .notEmpty()
    .withMessage('order_items에 user_id가 없는 데이터가 있습니다.')
    .isObject()
    .withMessage('user_id가 Object 타입이 아닙니다.'),
  body('order_items.*.user_id.shipping')
    .notEmpty()
    .withMessage('order_items에 shipping이 없는 데이터가 있습니다.')
    .isObject()
    .withMessage('shipping가 Object 타입이 아닙니다.'),
  body('order_items.*.product_id')
    .notEmpty()
    .withMessage('order_items에 product_id가 없는 데이터가 있습니다.')
    .isObject()
    .withMessage('product_id가 Object 타입이 아닙니다.'),
  body('order_items.*.product_id.category')
    .notEmpty()
    .withMessage('product_id에 category가 없습니다.')
    .isObject()
    .withMessage('category가 Object 타입이 아닙니다.'),
  body('order_items.*.product_id.category.species')
    .notEmpty()
    .withMessage('category에 species가 없습니다.')
    .isString()
    .withMessage('species가 String 타입이 아닙니다.'),
  body('order_items.*.product_id.price')
    .notEmpty()
    .withMessage('product_id에 price가 없습니다.')
    .isObject()
    .withMessage('price가 Object 타입이 아닙니다.'),
  body('order_items.*.product_id.stock')
    .notEmpty()
    .withMessage('product_id에 stock이 없습니다.')
    .toInt()
    .isInt()
    .withMessage('stock가 Int 타입이 아닙니다.')
    .isInt({ min: 1 })
    .withMessage('stock이 0 입니다.'),
  body('order_items.*.quantity')
    .notEmpty()
    .withMessage('order_items에 quantity가 없는 데이터가 있습니다.')
    .toInt()
    .isInt()
    .withMessage('quantity가 Int 타입이 아닙니다.')
    .isInt({ min: 1 })
    .withMessage('quantity가 0 입니다.'),
  validationErrorChecker,
];

exports.updateStatusOrder = [
  body('_id')
    .notEmpty()
    .withMessage('id 가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongoID 타입이 아닙니다.'),
  body('order_status')
    .notEmpty()
    .withMessage('order_status가 없습니다.')
    .isString()
    .withMessage('order_status가 String 타입이 아닙니다.'),
  validationErrorChecker,
];

exports.updateShippingOrder = [
  body('shipping')
    .notEmpty()
    .withMessage('order_items가 없습니다.')
    .isObject()
    .withMessage('order_items가 없습니다.'),
  body('shipping.user_id')
    .notEmpty()
    .withMessage('shipping에 user_id가 없습니다.')
    .isMongoId()
    .withMessage('user_id가 MongoID 타입이 아닙니다.'),
  body('shipping.zencode')
    .notEmpty()
    .withMessage('shipping에 zencode가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('zencode가 Int 타입이 아닙니다.'),
  body('shipping.address')
    .notEmpty()
    .withMessage('shipping에 address가 없습니다.')
    .isString()
    .withMessage('address가 String 타입이 아닙니다.'),
  body('shipping.detail_address')
    .notEmpty()
    .withMessage('shipping에 detail_address가 없습니다.')
    .isString()
    .withMessage('detail_address가 String 타입이 아닙니다.'),
  body('shipping.name')
    .notEmpty()
    .withMessage('shipping에 name이 없습니다.')
    .isString()
    .withMessage('name이 String 타입이 아닙니다.'),
  body('shipping.mobile')
    .notEmpty()
    .withMessage('shipping에 mobile이 없습니다.')
    .isString()
    .withMessage('mobile이 String타입이 아닙니다.'),
];

exports.cancelOrder = [
  param('_id')
    .notEmpty()
    .withMessage('param에 _id가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongId 타입이 아닙니다.'),
];
exports.deleteOrder = [
  param('_id')
    .notEmpty()
    .withMessage('param에 _id가 없습니다.')
    .isMongoId()
    .withMessage('_id가 MongId 타입이 아닙니다.'),
];
