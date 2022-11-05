import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService } from '../services';
import { sanitizeObject } from '../utils/sanitizeObject';

const userRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post('/signup', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { email, password } = req.body;
    const DTO = { email, password };
    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser(DTO);

    const result = { success: true, data: newUser };
    res.status(201).json(result);

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post('/login', async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request) 에서 데이터 가져오기
    const { email, password } = req.body;
    const DTO = { email, password };

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken(DTO);
    const result = { success: true, data: userToken };
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get('/list', loginRequired, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch('/:_id', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { _id } = req.params;

    // body data 로부터 업데이트할 사용자 정보를 추출함.

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

    // currentPassword 없을 시, 진행 불가
    if (!current_password) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(DTO);
    const result = { success: true, data: updatedUserInfo };
    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:_id', loginRequired, async (req, res, next) => {
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

userRouter.delete('/:_id', loginRequired, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { password } = req.body;
    const DTO = { _id, password };

    const deletedUser = await userService.deleteUser(DTO);

    const result = { success: true, data: deletedUser };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
export { userRouter };
