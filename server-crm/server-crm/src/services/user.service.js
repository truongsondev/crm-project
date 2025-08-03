import UserRepo from "../repositories/user.repo.js";

class UserSerivice {
  static async getListUser() {
    const users = await UserRepo.getListUser();

    const newlists = [];

    for (const user of users) {
      const name_manager = await UserRepo.findUserbyId(user?.manager_name);

      newlists.push({
        ...(user.toObject?.() || user),
        manager_name: name_manager
          ? `${name_manager.first_name} ${name_manager.last_name}`
          : null,
      });
    }
    const newList = newlists.filter((item) => !item.terminated_date);
    console.log(newList);
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
