import userModel from "../schema/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // Check if user registered with Google
        if (user.googleId && !user.password) {
            return res.json({
                success: false,
                message: "Please login with Google"
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id, user.role);
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            emailOTP: {
                code: otp,
                expiresAt: otpExpiry
            }
        });

        const user = await newUser.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, name);

        if (!emailResult.success) {
            await userModel.findByIdAndDelete(user._id);
            return res.json({
                success: false,
                message: "Failed to send verification email"
            });
        }

        res.json({
            success: true,
            message: "Registration successful! Please check your email for OTP",
            userId: user._id
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return res.json({
                success: false,
                message: "Email already verified"
            });
        }

        // Check OTP
        if (!user.emailOTP || user.emailOTP.code !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if OTP expired
        if (new Date() > user.emailOTP.expiresAt) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        // Update user
        user.isEmailVerified = true;
        user.emailOTP = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Create token
        const token = createToken(user._id, user.role);

        res.json({
            success: true,
            message: "Email verified successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.json({
                success: false,
                message: "Email already verified"
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.emailOTP = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(user.email, otp, user.name);

        if (!emailResult.success) {
            return res.json({
                success: false,
                message: "Failed to send OTP"
            });
        }

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Google Login
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        let user = await userModel.findOne({
            $or: [{ googleId }, { email }]
        });

        if (user) {
            // Update Google ID if user exists with email
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                user.isEmailVerified = true;
                await user.save();
            }
        } else {
            // Create new user
            user = new userModel({
                name,
                email,
                googleId,
                profilePicture: picture,
                isEmailVerified: true
            });
            await user.save();

            // Send welcome email
            await sendWelcomeEmail(email, name);
        }

        const token = createToken(user._id, user.role);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        const token = createToken('admin', 'admin');
        res.json({
            success: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

export {
    loginUser,
    registerUser,
    adminLogin,
    googleLogin,
    verifyOTP,
    resendOTP
};
