import jwt from "jsonwebtoken";
const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2d",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export default createTokenPair;
