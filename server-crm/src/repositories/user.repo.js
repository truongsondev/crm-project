import { BadRequestError } from "../http/error.http.js";
import User from "../schema/user.schema.js";

class UserRepo {
  static async findUser({ user_name }) {
    return await User.findOne({
      username: user_name,
    });
  }

  static async findUserbyId(_id) {
    try {
      return await User.findOne({ _id });
    } catch (err) {
      return null;
    }
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
    const normalizedUsers = users.map((u) => ({
      ...u,
      is_active: u.is_active === "true",
      is_manager: u.is_manager === "true",
    }));

    return await User.insertMany(normalizedUsers);
  }
  static async getListUser() {
    return await User.find();
  }

  static async updateUser({ _id, accessToken, refreshToken, publicKeyString }) {
    const user = await User.findById(_id);
    if (user) {
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      user.public_key = publicKeyString;
      await user.save();
      return user;
    }
  }

  static async updateFilterUser(id, data) {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError("User invalid");
    }
    Object.assign(user, data);

    return await user.save();
  }

  static async getUserById(_id) {
    return await User.findById(_id);
  }
}

export default UserRepo;
