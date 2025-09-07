import jwt from "jsonwebtoken";
const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const verifyToken = (token, publicKey) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (err) {
    return null;
  }
};
export { verifyToken, createTokenPair };
