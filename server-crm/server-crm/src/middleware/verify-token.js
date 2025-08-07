import { AuthorizedError } from "../http/error.http.js";
import { jwtDecode } from "jwt-decode";
import UserSerivice from "../services/user.service.js";
import { verifyToken } from "../jwt/token.js";

export async function checkToken(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      throw new AuthorizedError();
    }
    const at = token.split(" ")[1];
    const result = jwtDecode(token);
    const _id = result._id;
    const user = await UserSerivice.getUserById(_id);
    if (!user) {
      throw new AuthorizedError("Token invalid, please login again");
    }

    const public_key = user.public_key;
    if (!public_key) {
      throw new AuthorizedError("Token invalid, please login again");
    }
    const decode = verifyToken(at, public_key);
    console.log(decode);
    if (!decode) {
      throw new AuthorizedError("Token invalid, please login again");
    }
    if (decode && decode._id === _id) {
      req.role = user.role;
      next();
    }
  } catch (e) {
    next(e);
  }
}
