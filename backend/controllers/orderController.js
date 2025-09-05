import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// PLACE ORDER FOR COD
const placeOrder = async (req, res) => {
    try {
        const { userID, items, amount, address } = req.body;

        if (!items || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Items, amount, and address are required"
            });
        }

        const orderData = {
            userID,
            items,
            amount,
            address,
            status: "Order Placed",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user cart
        await userModel.findByIdAndUpdate(userID, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PLACE ORDER FOR PHONEPE
const placeOrderPhonepe = async (req, res) => {
    try {
        const { userID, items, amount, address } = req.body;

        // For now, just place the order as paid
        const orderData = {
            userID,
            items,
            amount,
            address,
            status: "Order Placed",
            payment: true, // PhonePe payment assumed successful
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user cart
        await userModel.findByIdAndUpdate(userID, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order placed and payment successful",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('PhonePe order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL ORDERS FOR ADMIN
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET USER ORDERS
const userOrders = async (req, res) => {
    try {
        const { userID } = req.body;

        const orders = await orderModel.find({ userID }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE ORDER STATUS
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required"
            });
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { placeOrder, placeOrderPhonepe, allOrders, userOrders, updateStatus };
