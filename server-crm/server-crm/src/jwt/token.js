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

const verifyToken = (accessToken, publicKey) => {
  try {
    const decoded = jwt.verify(accessToken, publicKey);
    return decoded;
  } catch (err) {
    console.log("err:::", err);
    return null;
  }
};
export { verifyToken, createTokenPair };
