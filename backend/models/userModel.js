import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        sparse: true
    },
    avatar: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pinCode: { type: String, default: null },
        country: { type: String, default: 'India' }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    cartData: {
        type: Object,
        default: {}
    }
}, {
    minimize: false,
    timestamps: true
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
