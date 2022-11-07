import { userModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(DTO) {
    // 객체 destructuring
    // const { email, password } = DTO;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(DTO.email);
    if (user) {
      throw new Error('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(DTO.password, 10);

    const newUserInfo = { email: DTO.email, password: hashedPassword };
    console.log(newUserInfo);
    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    const { password, ...newUserWithoutPassword } = createdNewUser.toObject();
    return newUserWithoutPassword;
  }

  // 로그인
  async getUserToken(DTO) {
    // 객체 destructuring
    const { email, password } = DTO;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('로그인 정보를 확인해주세요.');
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('로그인 정보를 확인해주세요.');
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.group }, secretKey, {
      issuer: 'hae3mul',
      expiresIn: '24h',
    });

    return { token };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  //특정 사용자 정보 전달
  async getUser(user_id) {
    const user = await this.userModel.findById(user_id);
    return user;
  }
  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(DTO) {
    // 객체 destructuring
    const { userInfo, shipping } = DTO;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userInfo._id);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(userInfo.current_password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    // 이제 드디어 업데이트 시작

    // 비밀번호를 변경하는 경우
    if (userInfo.new_password) {
      const hashedPassword = await bcrypt.hash(userInfo.new_password, 10);
      const update = { password: hashedPassword, shipping: shipping };
      console.log(update);

      // 업데이트 진행(비밀번호 변경)
      user = await this.userModel.update({
        _id: userInfo._id,
        update,
      });
    } else {
      // 주소만 변경하는 경우
      const update = { shipping: shipping };

      user = await this.userModel.update({
        _id: userInfo._id,
        update,
      });
    }
    const { password, ...updatedUserWithoutPassword } = user.toObject();
    return updatedUserWithoutPassword;
  }

  // 단일유저 조회
  async readUser(DTO) {
    const { _id } = DTO;
    const userInfo = await this.userModel.findById(_id);

    const { password, ...userInfoWithoutPassword } = userInfo.toObject();

    return userInfoWithoutPassword;
  }

  // 회원 탈퇴
  async deleteUser(DTO) {
    // 비밀번호 검증
    const user = await this.userModel.findById(DTO._id);
    const isPasswordCorrect = await bcrypt.compare(DTO.password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    // 탈퇴 처리
    const deletedUser = await this.userModel.delete(DTO._id);
    const { password, ...deletedUserWithoutPassword } = deletedUser.toObject();

    return deletedUserWithoutPassword;
  }
}

const userService = new UserService(userModel);

export { userService };
