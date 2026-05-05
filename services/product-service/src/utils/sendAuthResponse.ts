import { Response } from "express";
import { generateToken } from "./generateToken";
import { cookieOptions } from "./cookieOption";

export const sendAuthResponse = (res: Response, user: any, message: string) => {
  const token = generateToken(user._id.toString());
  res.cookie("smartbazar", token, cookieOptions);
  return res.status(200).json({
    message,
    user,
  });
};
