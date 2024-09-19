import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userModel } from "~/models/userModel";
import { env } from "./environment";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findOneById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      callbackURL: "/v1/auth-google/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOneByEmail(profile.emails[0].value);
        if (!user) {
          user = await userModel.createNewUser({
            email: profile.emails[0].value,
            name: profile.name.givenName || profile.displayName,
            password: "",
            telephone: "",
          });
        }
        const result = await userModel.findOneById(user.insertedId);
        done(null, result || user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
