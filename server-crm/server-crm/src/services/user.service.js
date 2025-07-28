import UserRepo from "../repositories/user.repo.js";

class UserSerivice {
  static async getListUser() {
    const users = await UserRepo.getListUser();

    const newList = users.filter((item) => !item.terminated_date);
    return newList;
  }

  static createUser = async (user) => {
    return await UserRepo.createUser(user);
  };

  static updateUser = async (id, data) => {
    return await UserRepo.updateFilterUser(id, data);
  };
}

export default UserSerivice;
