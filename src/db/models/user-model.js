import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email, deleted_at: null });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId, deleted_at: null });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({ deleted_at: null });
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId, deleted_at: null };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);

    return updatedUser;
  }
}

const userModel = new UserModel();

export { userModel };
