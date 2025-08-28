import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imagesByColor: {
        type: Map,
        of: String,
        default: new Map()
    },
    availableColors: [{
        type: String,
        required: true,
        enum: ['White', 'Black', 'Gray', 'Red', 'Orange']
    }],
    category: {
        type: String,
        required: true,
        enum: [
            'Idols & Spirituality',
            'Home & Office',
            'Characters',
            'Tools & Utilities',
            'Gaming'
        ],
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    bestseller: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel; 
