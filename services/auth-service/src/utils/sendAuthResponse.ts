import type { Response } from "express";
import { generateTokens } from "./generateTokens";

export const sendAuthResponse = (
  res: Response,
  user: unknown,
  message: string,
) => {
  const u = user as { _id: { toString: () => string } };

  const { accessToken, refreshToken } = generateTokens({
    id: u._id.toString(),
  });

  // 🍪 Access Token Cookie
  res.cookie("smartbazar-accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  // 🍪 Refresh Token Cookie
  res.cookie("smartbazar-refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message,
    user,
  });
};
