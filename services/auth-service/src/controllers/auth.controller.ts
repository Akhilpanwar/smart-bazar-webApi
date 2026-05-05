import { sendAuthResponse } from "../utils/sendAuthResponse";
import { handleError } from "../utils/handleError";
import type { Request, Response } from "express";
import { User } from "../models/user.model";
import generateAvatar from "../utils/generateAvatar";
import bcrypt from "bcrypt";
import { cookieOptions } from "../utils/cookieOption";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatar = await generateAvatar(name);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      });

      return sendAuthResponse(res, user, "Registered successfully");
    } catch (err) {
      return handleError(res, err, "Register error");
    }
  },

  async getMe(req: Request & { user?: { id: string } }, res: Response) {
    try {
      const user = await User.findById(req.user?.id).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      console.error("GetMe error:", error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.password) {
        return res.status(400).json({
          message: "Login using Google",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return sendAuthResponse(res, user, "Login successful");
    } catch (err) {
      return handleError(res, err, "Login error");
    }
  },

  async logout(_req: Request, res: Response) {
    try {
      res.cookie("smartbazar", "", {
        ...cookieOptions,
        maxAge: 0,
      });
      return res.json({ message: "Logged out successfully" });
    } catch (err) {
      return handleError(res, err, "Logout error");
    }
  },
};
