import { TokenService } from "../services/token.service.js";

export class TokenController {
  static resetToken = async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const responseData = await TokenService.resetToken(token);
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };
}
