import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../../keys/public.key"),
  "utf8",
);

const JWT_ISSUER = "auth-service";
const JWT_AUDIENCE = "ecommerce-app";

export interface AccessTokenPayload {
  sub: string;
  type: "access";
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
}

export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as AccessTokenPayload;

    if (decoded.type !== "access") {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    req.user = decoded;

    // Forward authenticated user identity
    req.headers["x-user-id"] = decoded.sub;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}
