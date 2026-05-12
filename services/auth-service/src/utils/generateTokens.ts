import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("keys/private.key", "utf8");

export const generateTokens = (user: { id: string }) => {
  const accessToken = jwt.sign(user, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
    issuer: "auth-service",
    audience: "ecommerce-app",
  });

  const refreshToken = jwt.sign(
    { id: user.id }, // keep minimal payload
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "7d",
      issuer: "auth-service",
      audience: "ecommerce-app",
    },
  );

  return { accessToken, refreshToken };
};
