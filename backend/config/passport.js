import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('Google account has no email'), null);
        }
        const avatar = profile.photos?.[0]?.value;

        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        user = await userModel.findOne({ email });

        if (user) {
            user.googleId = profile.id;
            user.avatar = avatar || user.avatar;
            user.isEmailVerified = true;
            await user.save();
            return done(null, user);
        }

        const newUser = new userModel({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar,
            isEmailVerified: true,
            cartData: {}
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);

    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
