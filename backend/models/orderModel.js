import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: {
        type: String,
        required: true,
        default: 'Order Placed',
        enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    payment: { type: Boolean, required: true, default: false },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['PHONEPE'],
        default: 'PHONEPE'
    },
    phonePeTxnId: { type: String, default: null },
    date: {
        type: Date, required: true, default: Date.now()
    }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
