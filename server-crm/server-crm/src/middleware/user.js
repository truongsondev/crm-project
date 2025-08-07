import { AuthorizedError } from "../http/error.http.js";

export function checkRole(req, res, next) {
  const role = req.role;
  if (role === "USER_ADMIN") {
    next();
  } else {
    throw new AuthorizedError();
  }
}
