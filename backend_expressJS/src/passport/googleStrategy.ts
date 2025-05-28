// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// import passport from "passport";
// import prisma from "../config/database";
// import dotenv from "dotenv";
// import { VerifyCallback } from "passport-oauth2";

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "http://localhost:8000/api/auth/google/callback",
//     },
//     async (
//       _accessToken: string,
//       _refreshToken: string,
//       profile: Profile,
//       done: VerifyCallback
//     ) => {
//       try {
//         const email = profile.emails?.[0].value;
//         if (!email) return done(null, false);

//         let user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               email,
//               username: profile.displayName.replace(/\s/g, "").toLowerCase(),
//               firstName: profile.name?.givenName || "",
//               lastName: profile.name?.familyName || "",
//               password: "", // Password left empty for OAuth users
//             },
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err as Error);
//       }
//     }
//   )
// );

import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import passport from "passport";
import prisma from "../config/database";
import dotenv from "dotenv";
import { VerifyCallback } from "passport-oauth2";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      scope: ["profile", "email"], // Ensure profile scope is included
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        // Extract photo if available
        const photo = profile.photos?.[0].value || null;
        
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              username: profile.displayName.replace(/\s/g, "").toLowerCase(),
              firstName: profile.name?.givenName || "",
              lastName: profile.name?.familyName || "",
              photo, // Add photo here
              password: "", // Password left empty for OAuth users
            },
          });
        } else if (photo && !user.photo) {
          // Update photo if it's not set
          user = await prisma.user.update({
            where: { email },
            data: { photo },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);