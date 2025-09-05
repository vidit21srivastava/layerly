import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../config/email.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Generate OTP (6 digits)
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate email verification token
        const verificationToken = nanoid(32);
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        });

        const user = await newUser.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            userId: user._id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        // Find user with this verification token
        const user = await userModel.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        // Update user as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        // Generate auth token
        const authToken = createToken(user._id);

        res.status(200).json({
            success: true,
            message: "Email verified successfully! Welcome to Layerly!",
            token: authToken
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESEND VERIFICATION EMAIL
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // Generate new verification token
        const verificationToken = nanoid(32);
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, user.name, verificationToken);

        res.status(200).json({
            success: true,
            message: "Verification email sent successfully!"
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check if user registered with Google
        if (user.googleId && !user.password) {
            return res.status(400).json({
                success: false,
                message: "Please login with Google or set a password first"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
                needsVerification: true
            });
        }

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user registered with Google only
        if (user.googleId && !user.password) {
            return res.status(400).json({
                success: false,
                message: "You registered with Google. Please login with Google or contact support."
            });
        }

        // Generate reset token
        const resetToken = nanoid(32);
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(email, user.name, resetToken);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Find user with valid reset token
        const user = await userModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GOOGLE AUTH SUCCESS
const googleAuthSuccess = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        const token = createToken(req.user._id);

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);

    } catch (error) {
        console.error('Google auth success error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_error`);
    }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userID).select('-password -emailVerificationToken -passwordResetToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                address: user.address,
                isEmailVerified: user.isEmailVerified,
                hasGoogleAccount: !!user.googleId
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const userId = req.body.userID;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = { ...user.address, ...address };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CHANGE/SET PASSWORD (profile page)
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.body.userID;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // If user has a password (normal/email signup), verify current password
        if (user.password) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required"
                });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
        } else {
            // If user is Google-only account without password, allow setting a fresh password
            // no currentPassword required
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: user.googleId && !user.password ? "Password set successfully" : "Password updated successfully"
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export {
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
};

