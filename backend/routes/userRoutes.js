import express from 'express';
import {
    loginUser,
    registerUser,
    adminLogin,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    googleAuthSuccess,
    getUserProfile,
    updateUserProfile,
    updatePassword
} from '../controllers/userController.js';

import passport from '../config/passport.js';
import userAuth from '../middleware/userAuth.js';
import rateLimit from 'express-rate-limit';

const userRouter = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Regular auth routes
userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);
userRouter.post('/admin', authLimiter, adminLogin);

// Email verification routes
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/resend-verification', resendVerificationEmail);

// Password reset routes
userRouter.post('/forgot-password', authLimiter, forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Google OAuth routes
userRouter.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

userRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`
    }),
    googleAuthSuccess
);

// Protected routes
userRouter.get('/profile', userAuth, getUserProfile);
userRouter.put('/profile', userAuth, updateUserProfile);
userRouter.put('/password', userAuth, updatePassword);

export default userRouter;
