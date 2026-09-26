import { sendAuthResponse } from "../utils/sendAuthResponse";
import { handleError } from "../utils/handleError";
import type { Request, Response } from "express";
import { Auth } from "../models/auth.model";
import bcrypt from "bcrypt";
import axios, { AxiosError } from "axios";
import { cookieOptions } from "../utils/cookieOption";
import dotenv from "dotenv";

dotenv.config();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const INTERNAL_KEY = process.env.INTERNAL_SERVICE_KEY;

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingAuth = await Auth.findOne({ email });
      if (existingAuth) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const authUser = await Auth.create({
        email,
        password: hashedPassword,
      });
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
      // Delegate profile creation to User Service with secret key header
      try {
        await axios.post(
          `${USER_SERVICE_URL}/internal/profile`,
          {
            authId: authUser._id,
            name,
            email,
            avatar: avatarUrl,
          },
          {
            headers: {
              "x-internal-service-key": INTERNAL_KEY,
            },
          },
        );
      } catch (serviceErr) {
        if (axios.isAxiosError(serviceErr)) {
          // console.error("User Service Error Details:", {
          //   status: serviceErr.response?.status,
          //   data: serviceErr.response?.data,
          //   message: serviceErr.message,
          // });
        } else {
          console.error("Unexpected Error in User Service Call:", serviceErr);
        }

        // Rollback if User Service fails
        await Auth.findByIdAndDelete(authUser._id);
        return res
          .status(500)
          .json({ message: "Failed to initialize user profile" });
      }

      return sendAuthResponse(res, authUser, "Registered successfully");
    } catch (err) {
      return handleError(res, err, "Register error");
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authUser = await Auth.findOne({ email }).select("+password");

      if (!authUser || !authUser.password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, authUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return sendAuthResponse(res, authUser, "Login successful");
    } catch (err) {
      return handleError(res, err, "Login error");
    }
  },

  async logout(_req: Request, res: Response) {
    try {
      res.cookie("smartbazar", "", { ...cookieOptions, maxAge: 0 });
      return res.json({ message: "Logged out successfully" });
    } catch (err) {
      return handleError(res, err, "Logout error");
    }
  },
};
