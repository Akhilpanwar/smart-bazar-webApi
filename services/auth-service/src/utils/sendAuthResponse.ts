import type { Response } from "express";
import { generateTokens } from "./generateTokens";

export const sendAuthResponse = (
  res: Response,
  user: unknown,
  message: string,
) => {
  const u = user as { _id: { toString: () => string } };
  const isProduction = process.env.NODE_ENV === "production";
  const { accessToken, refreshToken } = generateTokens({
    id: u._id.toString(),
  });

  // 🍪 Access Token Cookie
  res.cookie("smartbazar-accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("smartbazar-refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message,
    user,
  });
};
