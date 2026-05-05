import axios from "axios";
import { SOCIAL_PROVIDERS } from "../config/social.config";
import { User } from "../models/user.model";

const env = () => ({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
});

export const findOrCreateUser = async (userData: {
  providerId: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
}) => {
  let user = await User.findOne({ email: userData.email });

  if (!user) {
    const doc: Record<string, unknown> = {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || "",
    };
    if (userData.provider === "google") {
      doc.googleId = userData.providerId;
    } else if (userData.provider === "facebook") {
      doc.facebookId = userData.providerId;
    }
    user = await User.create(doc);
  }

  return user;
};

export const getAccessToken = async (
  provider: string,
  code: string,
): Promise<string> => {
  const c = env();

  if (provider === "google") {
    const res = await axios.post(SOCIAL_PROVIDERS.google.tokenUrl, {
      client_id: c.GOOGLE_CLIENT_ID,
      client_secret: c.GOOGLE_CLIENT_SECRET,
      redirect_uri: c.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
      code,
    });
    return res.data.access_token as string;
  }

  const res = await axios.get(SOCIAL_PROVIDERS.facebook.tokenUrl, {
    params: {
      client_id: c.FACEBOOK_APP_ID,
      client_secret: c.FACEBOOK_APP_SECRET,
      redirect_uri: c.FACEBOOK_CALLBACK_URL,
      code,
    },
  });

  return res.data.access_token as string;
};

export const getSocialUser = async (
  provider: string,
  accessToken: string,
): Promise<Record<string, unknown>> => {
  if (provider === "google") {
    const res = await axios.get(SOCIAL_PROVIDERS.google.userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data as Record<string, unknown>;
  }

  const res = await axios.get(SOCIAL_PROVIDERS.facebook.userUrl, {
    params: {
      access_token: accessToken,
      fields: "id,first_name,last_name,email,picture.type(large)",
    },
  });

  return res.data as Record<string, unknown>;
};

export const normalizeUser = (provider: string, data: Record<string, unknown>) => {
  if (provider === "google") {
    const pic = data.picture;
    const avatar =
      typeof pic === "string" ? pic : pic != null ? String(pic) : "";
    return {
      providerId: String(data.id),
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      avatar,
      provider: "google",
    };
  }

  const picture = data.picture as { data?: { url?: string } } | undefined;

  return {
    providerId: String(data.id),
    name: `${String(data.first_name ?? "")} ${String(data.last_name ?? "")}`.trim(),
    email: String(data.email ?? `${data.id}@facebook.com`),
    avatar: picture?.data?.url ?? "",
    provider: "facebook",
  };
};
