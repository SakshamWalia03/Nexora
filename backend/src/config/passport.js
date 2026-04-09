import crypto from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import userModel from "../models/user.model.js";
import config from "./config.js";
import { log } from "console";

const handleOAuthUser = async (profile, provider, email, displayName) => {
    const providerIdField = `${provider}Id`; // "googleId" | "githubId"

    // 1. Already linked this OAuth account?
    let user = await userModel.findOne({ [providerIdField]: profile.id });
    if (user) return user;

    // 2. Email already registered? Link the OAuth account to it.
    if (email) {
        user = await userModel.findOne({ email });
        if (user) {
            user[providerIdField] = profile.id;
            if (!user.verified) user.verified = true;
            await user.save();
            return user;
        }
    }

    // 3. Brand-new user — create account (random unusable password for OAuth users)
    const username =
        displayName.replace(/\s+/g, "_").toLowerCase() +
        "_" +
        Math.random().toString(36).slice(2, 7);

    user = await userModel.create({
        username,
        email: email || `${provider}_${profile.id}@oauth.placeholder`,
        password: crypto.randomBytes(32).toString("hex"),
        verified: true,
        [providerIdField]: profile.id,
    });

    return user;
};

// ── Google ──
passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_REDIRECT_URI,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value ?? null;
                const user = await handleOAuthUser(profile, "google", email, profile.displayName);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

// ── GitHub ──
passport.use(
    new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_REDIRECT_URI,
            scope: ["user:email"], 
        },
        async (_accessToken, _refreshToken, profile, done) => {
            log("GitHub profile:", profile);
            try {
                const email =
                    profile.emails?.find((e) => e.primary && e.verified)?.value ??
                    profile.emails?.[0]?.value ??
                    null;
                const user = await handleOAuthUser(profile, "github", email, profile.username);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);


export default passport;