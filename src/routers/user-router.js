import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired, isAdmin } from '../middlewares';
import { userService } from '../services';
import { sanitizeObject } from '../utils/sanitizeObject';
import * as userValidator from '../middlewares/validation/userValidator';

const userRouter = Router();

userRouter.post('/signup', userValidator.signUp, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const DTO = { email, password };

    const newUser = await userService.addUser(DTO);

    const result = { success: true, data: newUser };
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/sign-up', userValidator.signUp2, async (req, res, next) => {
  try {
    const { email, password, name, mobile, zencode, address, detail_address } = req.body;
    const DTO = { email, password, shipping: { name, mobile, zencode, address, detail_address } };
    console.log(DTO);

    const newUser = await userService.addUser2(DTO);

    const result = { success: true, data: newUser };
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/login', userValidator.login, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const { email, password } = req.body;
    const DTO = { email, password };

    const userToken = await userService.getUserToken(DTO);
    const result = { success: true, data: userToken };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/list', loginRequired, isAdmin, async function (req, res, next) {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.patch('/:_id', loginRequired, userValidator.updateUser, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const { _id } = req.params;

    const {
      current_password,
      new_password,
      name,
      mobile,
      zencode,
      address,
      address_type,
      detail_address,
    } = req.body;

    const userDTO = sanitizeObject({ _id, current_password, new_password });
    const shippingDTO = sanitizeObject({
      name,
      mobile,
      zencode,
      address,
      address_type,
      detail_address,
    });

    const DTO = { userInfo: userDTO, shipping: shippingDTO };

    if (!current_password) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const updatedUserInfo = await userService.setUser(DTO);
    const result = { success: true, data: updatedUserInfo };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:_id', loginRequired, userValidator.readUser, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const DTO = { _id };

    const userInfo = await userService.readUser(DTO);
    const result = { success: true, data: userInfo };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

userRouter.delete('/:_id', loginRequired, userValidator.deleteUser, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { password } = req.body;
    const DTO = { _id, password };

    await userService.deleteUser(DTO);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
export { userRouter };
