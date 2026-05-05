import { Response } from "express";

export const handleError = (
  res: Response,
  err: any,
  message = "Server Error",
) => {
  console.error(message, err);

  return res.status(500).json({
    success: false,
    message,
  });
};
