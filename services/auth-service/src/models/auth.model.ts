import { Schema, model, type Document } from "mongoose";

export interface IAuth extends Document {
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  role: "user" | "admin";
  isVerified: boolean;
  refreshToken?: string;
}

const AuthSchema = new Schema<IAuth>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false }, // Prevent returning password hash in queries by default
    googleId: { type: String, sparse: true },
    facebookId: { type: String, sparse: true },
    appleId: { type: String, sparse: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true },
);

export const Auth = model<IAuth>("Auth", AuthSchema);
