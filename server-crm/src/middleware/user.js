import { AuthorizedError, NotFoundUser } from "../http/error.http.js";
import { jwtDecode } from "jwt-decode";
import UserSerivice from "../services/user.service.js";
export function checkRole(req, res, next) {
  const role = req.role;
  if (role === "USER_ADMIN") {
    next();
  } else {
    throw new AuthorizedError();
  }
}

export async function checkUserExit(req, res, next) {
  const token = req.headers["authorization"];
  console.log(token);
  if (!token) {
    throw new AuthorizedError();
  }
  const accessToken = token.split(" ")[1];
  const result = jwtDecode(accessToken);
  const _id = result._id;
  const user = await UserSerivice.getUserById(_id);
  if (!user) {
    throw new NotFoundUser("User invalid, please login again");
  }
  req._id = _id;
  next();
}
