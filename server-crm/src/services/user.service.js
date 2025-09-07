import UserRepo from "../repositories/user.repo.js";
import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
import { format } from "date-fns";
import { NotFoundError } from "../http/error.http.js";
import { CommonService } from "./common.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISPLAY_ROLES = {
  USER_ADMIN: "Admin",
  DIR: "Director",
  SALES_MGR: "Sales Manager",
  SALES_EMP: "Sales Person",
  CONTACT_MGR: "Contact Manager",
  CONTACT_EMP: "Contact Employee",
  USER_READ_ONLY: "Guest",
};
class UserSerivice {
  static async getListUser() {
    const users = await UserRepo.getListUser();
    if (!users || users.length === 0) {
      throw new NotFoundError("No data found");
    }

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        let manager = null;

        if (user.manager_name) {
          const managerData = await UserRepo.findUserbyId(user.manager_name);
          if (managerData) {
            manager = {
              _id: managerData._id,
              name: `${managerData.first_name} ${managerData.last_name}`,
            };
          }
        }

        return {
          ...(user.toObject?.() || user),
          manager_name: manager,
        };
      })
    );

    const activeUsers = enrichedUsers.filter((u) => !u.terminated_date);

    const sanitizedUsers = activeUsers.map(
      ({ password, public_key, ...rest }) => rest
    );

    return sanitizedUsers;
  }

  static createUser = async (user) => {
    return await UserRepo.createUser(user);
  };

  static async createUsers(users) {
    const success = [];
    const failed = [];

    for (const user of users) {
      try {
        await UserRepo.createUser(user);
        success.push(user);
      } catch (err) {
        if (err.code === 11000) {
          failed.push({
            ...user,
            reason: "Duplicate " + Object.keys(err.keyValue).join(", "),
          });
        } else {
          failed.push({ ...user, reason: "Unknown error" });
        }
      }
    }
    return {
      success,
      failed,
    };
  }

  static async getUserById(_id) {
    return await UserRepo.findUserbyId(_id);
  }

  static updateUser = async (id, data) => {
    return await UserRepo.updateFilterUser(id, data);
  };

  static exportToFileCSV = async () => {
    const data = await this.getListUser();
    if (!data || data.length === 0) {
      throw new NotFoundError("No data found");
    }
    const formattedData = data.map((item) => {
      return {
        ...item,
        manager_name: item.manager_name ? item.manager_name?.name : "",

        created_on: item.created_on
          ? CommonService.formatDate(item.created_on)
          : "",
        updated_on: item.updated_on
          ? CommonService.formatDate(item.updated_on)
          : "",
        hired_date: item.hired_date
          ? CommonService.formatDate(item.hired_date)
          : "",
        role: DISPLAY_ROLES[item.role],
        is_active: item.is_active ? "Active" : "Inactive",
        is_manager: item.is_manager ? "Manager" : "Employee",
      };
    });

    const opts = {};
    const parser = new Parser(opts);
    const csv = parser.parse(formattedData);

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
