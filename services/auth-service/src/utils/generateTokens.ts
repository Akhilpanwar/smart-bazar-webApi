import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../../keys/private.key"),
  "utf8",
);

const JWT_ISSUER = "auth-service";
const JWT_AUDIENCE = "ecommerce-app";

export const generateTokens = (user: { id: string }) => {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      type: "access",
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      expiresIn: "15m",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: "refresh",
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      expiresIn: "7d",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};
