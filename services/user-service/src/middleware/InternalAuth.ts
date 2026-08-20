import { Request, Response, NextFunction } from "express";

export const verifyInternalKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const internalKey = req.headers["x-internal-service-key"];
  const expectedKey = process.env.INTERNAL_SERVICE_KEY;

  if (!internalKey || internalKey !== expectedKey) {
    return res.status(403).json({ message: "Forbidden: Invalid internal key" });
  }

  next();
};
