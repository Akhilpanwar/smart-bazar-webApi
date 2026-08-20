import { Request, Response } from "express";
import { UserProfile } from "../models/user.model";

export const userController = {
  // 1. Called by Client via API Gateway (Requires JWT token checked at Gateway)
  async getUser(req: Request, res: Response) {
    try {
      // Injected into request header by API Gateway's verifyJWT middleware
      const authId = req.headers["x-user-id"] as string;

      if (!authId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Missing user header" });
      }

      const profile = await UserProfile.findOne({ authId });

      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      return res.status(200).json({
        message: "User profile fetched successfully",
        user: profile,
      });
    } catch (error) {
      console.error("getUser error:", error);
      return res
        .status(500)
        .json({ message: "Server error fetching user profile" });
    }
  },

  // 2. Called strictly by Auth Service during registration/OAuth (No user token needed)
  async createProfileInternal(req: Request, res: Response) {
    try {
      const { authId, name, avatar } = req.body;

      if (!authId || !name) {
        return res
          .status(400)
          .json({ message: "authId and name are required" });
      }

      const profile = await UserProfile.create({
        authId,
        name,
        avatar: avatar || "",
      });

      return res.status(201).json({
        message: "Profile created successfully",
        profile,
      });
    } catch (error) {
      console.error("createProfileInternal error:", error);
      return res.status(500).json({ message: "Failed to create profile" });
    }
  },
};
