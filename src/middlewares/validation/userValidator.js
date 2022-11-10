import { param, body } from 'express-validator';
import { validationErrorChecker } from './validatorErrorChecker';

export const signUp = [
  body('email')
    .notEmpty()
    .withMessage('Email이 없습니다.')
    .isEmail()
    .withMessage('Email 형식을 확인해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('password가 없습니다.')
    .isLength({ min: 4, max: 20 })
    .withMessage('비밀번호를 최소 4자, 최대 20자로 설정해주세요.'),
  validationErrorChecker,
];

export const login = [
  body('email')
    .notEmpty()
    .withMessage('Email이 없습니다.')
    .isEmail()
    .withMessage('Email 형식을 확인해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('password가 없습니다.')
    .isLength({ min: 4, max: 20 })
    .withMessage('비밀번호를 최소 4자, 최대 20자로 설정해주세요.'),
  validationErrorChecker,
];

export const readUser = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),

  validationErrorChecker,
];

export const updateUser = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),
  body('current_password').notEmpty().withMessage('current_password가 없습니다.'),
  body('new_password').notEmpty().withMessage('new_password가 없습니다.'),
  body('name').notEmpty().withMessage('name이 없습니다.'),
  body('mobile').notEmpty().withMessage('mobile이 없습니다.'),
  body('zencode')
    .notEmpty()
    .withMessage('zencode가 없습니다.')
    .toInt()
    .isInt()
    .withMessage('zencode가 Int타입이 아닙니다'),
  body('address')
    .notEmpty()
    .withMessage('address가 없습니다.')
    .isString()
    .withMessage('address가 String 타입이 아닙니다.'),
  // body('address_type')
  //   .notEmpty()
  //   .withMessage('address_type이 없습니다.')
  //   .isString()
  //   .withMessage('address_type이 String 타입이 아닙니다.'),
  body('detail_address')
    .notEmpty()
    .withMessage('detail_address가 없습니다.')
    .isString()
    .withMessage('detail_address가 String 타입이 아닙니다.'),
  validationErrorChecker,
];

export const deleteUser = [
  param('_id')
    .notEmpty()
    .withMessage('_id param이 없습니다.')
    .isMongoId()
    .withMessage('_id param가 MongoId 타입이 아닙니다.'),
  validationErrorChecker,
];
