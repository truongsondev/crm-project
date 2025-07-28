import User from "../schema/user.schema.js";

class UserRepo {
  static async findUser({ user_name }) {
    return await User.findOne({
      username: user_name,
    });
  }

  static async findUsers({ user_name }) {
    return await User.find({
      username: user_name,
    });
  }

  static async createUser(user) {
    return await User.insertOne(user);
  }
  static async createUsers(users) {
    return await User.insertMany(users);
  }
  static async getListUser() {
    return await User.find();
  }

  static async updateUser({ _id, accessToken, refreshToken }) {
    const user = await User.findById(_id);
    if (user) {
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      await user.save();
      return user;
    }
  }

  static async updateFilterUser(id, data) {
    return await User.findByIdAndUpdate(id, data);
  }
}

export default UserRepo;
