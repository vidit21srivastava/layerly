// backend/models/customQuoteModel.js
import mongoose from "mongoose";

const customQuoteSchema = new mongoose.Schema(
    {
        // who requested
        userID: { type: String, default: null }, // optional if logged-in
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: null },

        // print params (from frontend Custom.jsx)
        material: { type: String, required: true, enum: ['PLA', 'PETG', 'ABS', 'TPU'] },
        layerHeight: { type: String, required: true, enum: ['0.12', '0.16', '0.20', '0.28'] },
        infill: { type: Number, required: true, min: 0, max: 100 },
        infillPattern: {
            type: String,
            required: true,
            enum: [
                'grid', 'lines', 'triangles', 'tri-hexagon', 'cubic',
                'cubic-subdivision', 'octet', 'quarter-cubic', 'concentric',
                'zig-zag', 'cross', 'cross-3d', 'gyroid', 'lightning'
            ]
        },
        supports: { type: Boolean, default: false },
        brim: { type: Boolean, default: false },
        raft: { type: Boolean, default: false },
        color: { type: String, required: true, enum: ['red', 'orange', 'gray', 'white', 'black'] },
        instructions: { type: String, default: '' },

        // Google Drive link to STL
        fileUrl: { type: String, required: true },

        // admin workflow
        status: { type: String, enum: ['PENDING', 'REPLIED', 'CLOSED'], default: 'PENDING' },
        adminRemark: { type: String, default: '' },
        price: { type: Number, default: null },
    },
    { timestamps: true }
);

const CustomQuote =
    mongoose.models.custom_quote || mongoose.model("custom_quote", customQuoteSchema);

export default CustomQuote;
