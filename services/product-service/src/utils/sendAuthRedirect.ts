import { Response } from "express";
import { generateToken } from "./generateToken";
import { cookieOptions } from "./cookieOption";
export const sendAuthRedirect = (res: Response, user: any, url: string) => {
  const token = generateToken(user._id.toString());

  res.cookie("smartbazar", token, cookieOptions);

  return res.redirect(url);
};
