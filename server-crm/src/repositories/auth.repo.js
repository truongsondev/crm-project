import User from "../schema/user.schema.js";

class AuthRepo {
  static async findUser({ user_name }) {
    return await User.find({
      user_name: user_name,
    });
  }

  static async getListUser() {
    return await User.find();
  }

  static async updateFilterUser(id, data) {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return user;
  }
}

export default AuthRepo;
