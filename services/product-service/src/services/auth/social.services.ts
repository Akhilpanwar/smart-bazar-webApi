import axios from "axios";
import { SOCIAL_PROVIDERS } from "@/config/social.config";
import { User } from "../../models/user.model";

export const findOrCreateUser = async (userData: any) => {
  let user = await User.findOne({
    $or: [{ email: userData.email }, { providerId: userData.providerId }],
  });

  if (!user) user = await User.create(userData);

  return user;
};

export const getAccessToken = async (
  provider: string,
  code: string,
  config: any,
) => {
  if (provider === "google") {
    const res = await axios.post(SOCIAL_PROVIDERS.google.tokenUrl, {
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      redirect_uri: config.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
      code,
    });
    return res.data.access_token;
  }

  const res = await axios.get(SOCIAL_PROVIDERS.facebook.tokenUrl, {
    params: {
      client_id: config.FACEBOOK_APP_ID,
      client_secret: config.FACEBOOK_APP_SECRET,
      redirect_uri: config.FACEBOOK_CALLBACK_URL,
      code,
    },
  });

  return res.data.access_token;
};

export const getSocialUser = async (provider: string, accessToken: string) => {
  if (provider === "google") {
    const res = await axios.get(SOCIAL_PROVIDERS.google.userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data;
  }

  const res = await axios.get(SOCIAL_PROVIDERS.facebook.userUrl, {
    params: {
      access_token: accessToken,
      fields: "id,first_name,last_name,email,picture.type(large)",
    },
  });

  return res.data;
};

export const normalizeUser = (provider: string, data: any) => {
  if (provider === "google") {
    return {
      providerId: data.id,
      name: data.name,
      email: data.email,
      avatar: data.picture,
      provider: "google",
    };
  }

  return {
    providerId: data.id,
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
    email: data.email || `${data.id}@facebook.com`,
    avatar: data.picture?.data?.url || "",
    provider: "facebook",
  };
};
