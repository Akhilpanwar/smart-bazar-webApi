import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../keys/public.key"),
  "utf8",
);

export interface AuthRequest extends Request {
  user?: any;
}

export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    req.user = decoded;

    // 👇 optional: forward user info to downstream services
    req.headers["x-user-id"] = (decoded as any).userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
