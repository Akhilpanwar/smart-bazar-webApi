import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.smartbazar;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as Request & { user?: { id: string } }).user = decoded as {
      id: string;
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
