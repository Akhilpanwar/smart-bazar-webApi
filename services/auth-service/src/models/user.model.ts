import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
  avatar?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    appleId: { type: String },
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", UserSchema);
