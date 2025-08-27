import { OKE } from "../http/success.http.js";
import AuthService from "../services/auth.service.js";

export class AuthController {
  static signIn = async (req, res, next) => {
    try {
      const { user_name, password } = req.body;
      const response = await AuthService.signIn({ user_name, password });
      return new OKE({ data: response }).send(res);
    } catch (e) {
      next(e);
    }
  };

  static resetToken = async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const id = req.body.id;
      const response = await AuthService.resetToken(token, id);
      return new OKE({ data: response }).send(res);
    } catch (e) {
      next(e);
    }
  };
}
