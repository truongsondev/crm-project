import UserRepo from "../repositories/user.repo.js";
import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

    return newList;
  }

  static createUser = async (user) => {
    return await UserRepo.createUser(user);
  };

  static createUsers = async (users) => {
    return await UserRepo.createUsers(users);
  };

  static updateUser = async (id, data) => {
    return await UserRepo.updateFilterUser(id, data);
  };

  static exportToFileCSV = async () => {
    const data = await this.getListUser();

    const opts = {};
    const parser = new Parser(opts);
    const csv = parser.parse(data);

    const fileName = "data.csv";
    const dirPath = path.join(__dirname, "temp");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, csv, "utf8");

    return {
      filePath,
      fileName,
    };
  };
}

export default UserSerivice;
