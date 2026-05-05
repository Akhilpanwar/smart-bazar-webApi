export const SOCIAL_PROVIDERS = {
  google: {
    name: "google",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: ["profile", "email"],
  },
  facebook: {
    name: "facebook",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    userUrl: "https://graph.facebook.com/me",
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    scope: ["email", "public_profile"],
  },
};
