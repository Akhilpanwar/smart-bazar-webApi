import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models/user.model";
import config from "./app";

/* ================= GOOGLE ================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    },
  ),
);

/* ================= FACEBOOK ================= */
passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_APP_ID!,
      clientSecret: config.FACEBOOK_APP_SECRET!,
      callbackURL: config.FACEBOOK_CALLBACK_URL!,
      scope: ["public_profile", "email", "user_friends", "manage_pages"],
      profileFields: [
        "id",
        "displayName",
        "name",
        "emails",
        "gender",
        "birthday",
        "photos",
      ],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Facebook profile"), false);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar,
            facebookId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    },
  ),
);

export default passport;
