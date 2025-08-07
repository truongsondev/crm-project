import { generateKeyPairSync } from "crypto";
import { createTokenPair } from "../jwt/token.js";
import UserRepo from "../repositories/user.repo.js";
import { verifyToken } from "../jwt/token.js";
import { AuthorizedError } from "../http/error.http.js";
import { jwtDecode } from "jwt-decode";

export class TokenService {
  static async resetToken(refreshToken) {
    const token = refreshToken;

    if (!token) {
      throw new AuthorizedError();
    }
    const at = token.split(" ")[1];
    const result = jwtDecode(at);
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
      const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
      });
      const publicKeyString = publicKey
        .export({ type: "pkcs1", format: "pem" })
        .toString();
      const { accessToken, refreshToken } = createTokenPair(
        {
          _id: user._id,
        },
        publicKeyString,
        privateKey
      );
      const saveUser = await UserRepo.updateUser({
        _id: user._id,
        accessToken,
        refreshToken,
        publicKeyString,
      });
      if (!saveUser) {
        throw new Error("Internal Server Error");
      }
      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new AuthorizedError("User mismatch. Please login again.");
    }
  }
}
