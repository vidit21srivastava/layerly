// import express from 'express';
// import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';

// const userRouter = express.Router();


// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.post('/admin', adminLogin);

// export default userRouter;


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
    updateUserProfile
} from '../controllers/userController.js';
import passport from '../config/passport.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Regular auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Email verification routes
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/resend-verification', resendVerificationEmail);

// Password reset routes
userRouter.post('/forgot-password', forgotPassword);
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

export default userRouter;
