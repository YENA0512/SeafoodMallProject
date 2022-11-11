import { userModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUser(DTO) {
    const user = await this.userModel.findByEmail(DTO.email);
    if (user) {
      throw new Error('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }

    const hashSalt = parseInt(process.env.HASH_SALT);
    const hashedPassword = await bcrypt.hash(DTO.password, hashSalt);

    const newUserInfo = { email: DTO.email, password: hashedPassword };

    const createdNewUser = await this.userModel.create(newUserInfo);

    const { password, ...newUserWithoutPassword } = createdNewUser.toObject();
    return newUserWithoutPassword;
  }

  async addUser2(DTO) {
    const user = await this.userModel.findByEmail(DTO.email);
    if (user) {
      throw new Error('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }

    const hashSalt = parseInt(process.env.HASH_SALT);
    const hashedPassword = await bcrypt.hash(DTO.password, hashSalt);

    const newUserInfo = { email: DTO.email, password: hashedPassword, shipping: DTO.shipping };

    const createdNewUser = await this.userModel.create(newUserInfo);

    const { password, ...newUserWithoutPassword } = createdNewUser.toObject();
    return newUserWithoutPassword;
  }

  async getUserToken(DTO) {
    const { email, password } = DTO;

    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('로그인 정보를 확인해주세요.');
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('로그인 정보를 확인해주세요.');
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign({ userId: user._id, role: user.group }, secretKey, {
      issuer: process.env.JWT_ISSUER,
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
    });

    return { token };
  }

  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUser(user_id) {
    const user = await this.userModel.findById(user_id);
    return user;
  }
  async setUser(DTO) {
    const { userInfo, shipping } = DTO;

    let user = await this.userModel.findById(userInfo._id);

    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(userInfo.current_password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    if (userInfo.new_password) {
      const hashedPassword = await bcrypt.hash(userInfo.new_password, 10);
      const update = { password: hashedPassword, shipping: shipping };

      user = await this.userModel.update({
        _id: userInfo._id,
        update,
      });
    } else {
      const update = { shipping: shipping };

      user = await this.userModel.update({
        _id: userInfo._id,
        update,
      });
    }
    const { password, ...updatedUserWithoutPassword } = user.toObject();
    return updatedUserWithoutPassword;
  }

  async readUser(DTO) {
    const { _id } = DTO;
    const userInfo = await this.userModel.findById(_id);

    const { password, ...userInfoWithoutPassword } = userInfo.toObject();

    return userInfoWithoutPassword;
  }

  async deleteUser(DTO) {
    const user = await this.userModel.findById(DTO._id);
    const isPasswordCorrect = await bcrypt.compare(DTO.password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    const deletedUser = await this.userModel.delete(DTO._id);
    const { password, ...deletedUserWithoutPassword } = deletedUser.toObject();

    return deletedUserWithoutPassword;
  }
}

const userService = new UserService(userModel);

export { userService };
