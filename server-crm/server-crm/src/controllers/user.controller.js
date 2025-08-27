import AuthService from "../services/auth.service.js";
import UserSerivice from "../services/user.service.js";
import fs from "fs";
import { OKE, SuccessResponse } from "../http/success.http.js";
class UserController {
  static getListUser = async (req, res, next) => {
    try {
      const users = await UserSerivice.getListUser();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  static createUser = async (req, res, next) => {
    try {
      const user = req.body;
      console.log(user);
      const users = await UserSerivice.createUser(user);
      res.status(200).json({
        code: 200000,
        users: users,
      });
    } catch (e) {
      console.log(e);
    }
  };

  static createUsers = async (req, res, next) => {
    try {
      const users = req.body;
      const usersRes = await UserSerivice.createUsers(users);
      res.status(200).json(usersRes);
    } catch (e) {
      console.log(e);

      next(e);
    }
  };

  static updateUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = req.body;
      const data = await UserSerivice.updateUser(id, user);
      res.status(200).json({
        code: 200000,
        users: data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  static exportToFileCSV = async (req, res, next) => {
    try {
      const { filePath, fileName } = await UserSerivice.exportToFileCSV();

      res.download(filePath, fileName, (err) => {
        if (err) {
          next(err);
        }

        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default UserController;
