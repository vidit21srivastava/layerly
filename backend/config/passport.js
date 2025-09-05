import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Profile:', profile);


        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
            console.log('Existing Google user found:', user.email);
            return done(null, user);
        }


        user = await userModel.findOne({ email: profile.emails[0].value });

        if (user) {

            console.log('Linking Google account to existing user:', user.email);
            user.googleId = profile.id;
            user.avatar = profile.photos[0]?.value || user.avatar;
            user.isEmailVerified = true;
            await user.save();
            return done(null, user);
        }


        console.log('Creating new Google user:', profile.emails[0].value);
        const newUser = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0]?.value,
            isEmailVerified: true,
            cartData: {}
        });

        const savedUser = await newUser.save();
        console.log('New Google user created:', savedUser.email);
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
