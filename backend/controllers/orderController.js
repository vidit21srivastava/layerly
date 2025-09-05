import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Product from "../models/productModel.js";


const placeOrderPhonepe = async (req, res) => {
    try {
        const { userID, items, address, phonePeTxnId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Items are required" });
        }
        if (!address) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }


        let subtotal = 0;
        for (const item of items) {
            if (!item.productId || !item.quantity || !item.color) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must include productId, color, and quantity"
                });
            }
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }
            subtotal += product.price * Number(item.quantity);
        }

        const deliveryFee = 60;
        const totalAmount = subtotal + deliveryFee;

        const orderData = {
            userID,
            items,
            amount: totalAmount,
            address,
            status: "Order Placed",
            payment: true,
            paymentMethod: "PHONEPE",
            phonePeTxnId: phonePeTxnId || null,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();


        await userModel.findByIdAndUpdate(userID, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order placed and payment successful",
            orderId: newOrder._id,
            amount: totalAmount
        });
    } catch (error) {
        console.error('PhonePe order error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL ORDERS FOR ADMIN
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET USER ORDERS
const userOrders = async (req, res) => {
    try {
        const { userID } = req.body;
        const orders = await orderModel.find({ userID }).sort({ date: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE ORDER STATUS
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrderPhonepe, allOrders, userOrders, updateStatus };
