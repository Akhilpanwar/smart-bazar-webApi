import type { Response } from "express";
import { generateTokens } from "./generateTokens";

export const sendAuthRedirect = (res: Response, user: unknown, url: string) => {
  const u = user as { _id: { toString: () => string }; role?: string };

  const { accessToken, refreshToken } = generateTokens({
    id: u._id.toString(),
  });

  // 🍪 Access Token
  res.cookie("smartbazar-accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  // 🍪 Refresh Token
  res.cookie("smartbazar-refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.redirect(url);
};
