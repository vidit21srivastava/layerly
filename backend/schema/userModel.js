import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password required only if not Google auth
        }
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailOTP: {
        code: String,
        expiresAt: Date
    },
    cartData: {
        type: Object,
        default: {}
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    minimize: false,
    timestamps: true
});

userSchema.index({ "emailOTP.expiresAt": 1 }, { expireAfterSeconds: 0 });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
