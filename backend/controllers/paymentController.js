import axios from "axios";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
import userModel from "../models/userModel.js";
import PaymentIntent from "../models/paymentIntentModel.js";

const PHONEPE_BASE_URL =
    process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || 1;

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// cache token in memory
let accessToken = null;
let accessTokenExpiry = 0;

// fetching new OAuth token if expired
async function getPhonePeToken() {
    const now = Math.floor(Date.now() / 1000);

    if (accessToken && accessTokenExpiry > now + 60) {
        return accessToken;
    }

    const res = await axios.post(
        `${PHONEPE_BASE_URL}/v1/oauth/token`,
        new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            client_version: CLIENT_VERSION,
            grant_type: "client_credentials",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = res.data.access_token;
    accessTokenExpiry = res.data.expires_at;
    return accessToken;
}

export const initiatePhonePe = async (req, res) => {
    try {
        const { items, address, userID } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
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
                    message: "Each item must include productId, color, and quantity",
                });
            }
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
            }
            subtotal += product.price * Number(item.quantity);
        }

        const deliveryFee = 60;
        const totalAmount = subtotal + deliveryFee;
        const merchantOrderId = "MO-" + Date.now();


        await PaymentIntent.create({
            merchantTransactionId: merchantOrderId,
            userID,
            items,
            amount: totalAmount,
            address,
            status: "PENDING",
        });


        const token = await getPhonePeToken();

        const payload = {
            merchantOrderId,
            amount: Math.round(totalAmount * 100), // paisa
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl: `${BACKEND_URL}/api/payment/phonepe/callback?merchantOrderId=${merchantOrderId}`,
                },
            },
        };

        const phonepeRes = await axios.post(
            `${PHONEPE_BASE_URL}/checkout/v2/pay`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${token}`,
                },
            }
        );

        const data = phonepeRes.data;
        if (data?.redirectUrl) {
            return res.status(200).json({
                success: true,
                redirectUrl: data.redirectUrl,
                merchantTransactionId: merchantOrderId,
                amount: totalAmount,
            });
        }

        return res.status(500).json({ success: false, message: "Failed to create payment session" });
    } catch (err) {
        console.error("PhonePe initiate error:", err.response?.data || err.message);
        return res.status(500).json({
            success: false,
            message: err.response?.data?.message || err.message,
        });
    }
};

export const phonePeCallback = async (req, res) => {
    try {
        const { merchantOrderId } = { ...req.query, ...req.body };
        if (!merchantOrderId) {
            return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
        }

        const token = await getPhonePeToken();

        // Fetch order status from PhonePe
        const statusRes = await axios.get(
            `${PHONEPE_BASE_URL}/checkout/v2/order/${merchantOrderId}/status?details=true`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${token}`,
                },
            }
        );

        const data = statusRes.data;
        const orderState = data?.state;
        const phonePeOrderId = data?.orderId;
        const phonePeTxnId = data?.paymentDetails?.[0]?.transactionId || null;

        // Find saved intent
        const intent = await PaymentIntent.findOne({ merchantTransactionId: merchantOrderId });
        if (!intent) {
            return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
        }

        // Update intent with PhonePe response
        intent.phonePeOrderId = phonePeOrderId;
        intent.phonePeTxnId = phonePeTxnId;
        intent.rawResponse = data;

        if (orderState === "COMPLETED") {
            await orderModel.create({
                userID: intent.userID,
                items: intent.items,
                amount: intent.amount,
                address: intent.address,
                status: "Order Placed",
                payment: true,
                paymentMethod: "PHONEPE",
                phonePeTxnId: phonePeTxnId,
                date: Date.now(),
            });

            await userModel.findByIdAndUpdate(intent.userID, { cartData: {} });

            intent.status = "SUCCESS";
            await intent.save();

            return res.redirect(`${FRONTEND_URL}/orders?payment=success`);
        } else if (orderState === "FAILED") {
            intent.status = "FAILED";
            await intent.save();

            return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
        } else {
            // Still pending
            intent.status = "PENDING";
            await intent.save();

            return res.redirect(`${FRONTEND_URL}/orders?payment=pending`);
        }
    } catch (err) {
        console.error("PhonePe callback error:", err.response?.data || err.message);
        return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
    }
};
