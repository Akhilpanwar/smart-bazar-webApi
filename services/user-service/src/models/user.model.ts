import { Schema, model, type Document } from "mongoose";

export interface IUserProfile extends Document {
  authId: string; // Refers to the _id from Auth Service
  name: string;
  avatar?: string;
  phone?: string;
  email?: String;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    authId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true },
);

export const UserProfile = model<IUserProfile>(
  "UserProfile",
  UserProfileSchema,
);
