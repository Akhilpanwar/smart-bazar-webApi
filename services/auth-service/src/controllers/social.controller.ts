import type { Request, Response } from "express";
import {
  getAccessToken,
  getSocialUser,
  normalizeUser,
  findOrCreateUser,
} from "../services/social.services";
import { sendAuthRedirect } from "../utils/sendAuthRedirect";
import { handleError } from "../utils/handleError";

function paramToString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export const socialLogin = async (req: Request, res: Response) => {
  const provider = paramToString(req.params.provider);

  if (!provider) {
    return res.status(400).json({ message: "Invalid provider" });
  }

  let url = "";

  if (provider === "facebook") {
    url =
      (process.env.FACEBOOK_AUTH_URL || "") +
      new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID || "",
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL || "",
        scope: "email,public_profile",
      });
  }

  if (provider === "google") {
    console.log("Google login requested");
    url =
      (process.env.GOOGLE_AUTH_URL || "") +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        redirect_uri: process.env.GOOGLE_CALLBACK_URL || "",
        response_type: "code",
        scope: "openid email profile",
      });
  }

  if (!url) {
    return res.status(400).json({ message: "Unknown provider" });
  }

  res.redirect(url);
};

export const socialCallback = async (req: Request, res: Response) => {
  try {
    const provider = paramToString(req.params.provider);
    const code = paramToString(req.query.code as string | string[] | undefined);

    if (!provider) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    if (!code) {
      return res.status(400).json({ message: "No code provided" });
    }

    const accessToken = await getAccessToken(provider, code);
    const socialUser = await getSocialUser(provider, accessToken);
    const userData = normalizeUser(provider, socialUser);
    const user = await findOrCreateUser(userData);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return sendAuthRedirect(res, user, clientUrl);
  } catch (err) {
    return handleError(res, err, "Social login error");
  }
};
