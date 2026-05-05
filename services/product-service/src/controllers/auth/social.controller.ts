import { Request, Response } from "express";
import {
  getAccessToken,
  getSocialUser,
  normalizeUser,
  findOrCreateUser,
} from "../../services/auth/social.services";
import { sendAuthResponse } from "../../utils/sendAuthResponse";
import { handleError } from "../../utils/handleError";
import config from "../../config/app";
import { sendAuthRedirect } from "@/utils/sendAuthRedirect";

export const socialLogin = async (req: Request, res: Response) => {
  const { provider } = req.params;

  let url = "";

  if (provider === "facebook") {
    url =
      config.FACEBOOK_AUTH_URL +
      new URLSearchParams({
        client_id: config.FACEBOOK_APP_ID,
        redirect_uri: config.FACEBOOK_CALLBACK_URL,
        scope: "email,public_profile",
      });
  }

  if (provider === "google") {
    url =
      config.GOOGLE_AUTH_URL +
      new URLSearchParams({
        client_id: config.GOOGLE_CLIENT_ID,
        redirect_uri: config.GOOGLE_CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
      });
  }

  res.redirect(url);
};

export const socialCallback = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: "No code provided" });
    }

    const accessToken = await getAccessToken(provider as any, code, config);

    const socialUser = await getSocialUser(provider as any, accessToken);

    const userData = normalizeUser(provider as any, socialUser);

    const user = await findOrCreateUser(userData);

    return sendAuthRedirect(res, user, config.CLIENT_URL);
  } catch (err) {
    return handleError(res, err, "Social login error");
  }
};
