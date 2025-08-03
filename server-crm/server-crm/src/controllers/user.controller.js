import AuthService from "../services/auth.service.js";
import UserSerivice from "../services/user.service.js";

class UserController {
  static getListUser = async (req, res, next) => {
    try {
      const users = await UserSerivice.getListUser();
      res.status(200).json({
        code: 200000,
        users: users,
      });
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

  static signIn = async (req, res, next) => {
    const { user_name, password } = req.body;
    const response = await AuthService.signIn({ user_name, password });
    res.status(200).json(response);
  };
}

export default UserController;
