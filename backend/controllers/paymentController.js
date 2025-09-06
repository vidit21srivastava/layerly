// backend/controllers/paymentController.js
import axios from 'axios';
import crypto from 'crypto';
import orderModel from '../models/orderModel.js';
import Product from '../models/productModel.js';

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function buildXVerify(base64Payload, path) {
    const toSign = (base64Payload ? base64Payload : '') + path + SALT_KEY;
    const hash = crypto.createHash('sha256').update(toSign).digest('hex');
    return `${hash}###${SALT_INDEX}`;
}


export const initiatePhonePe = async (req, res) => {
    try {
        console.log('=== PhonePe Debug Info ===');
        console.log('MERCHANT_ID:', MERCHANT_ID);
        console.log('SALT_KEY (first 8 chars):', SALT_KEY?.substring(0, 8) + '...');
        console.log('SALT_INDEX:', SALT_INDEX);
        console.log('BASE_URL:', PHONEPE_BASE_URL);
        console.log('========================');
        const { items, address } = req.body;
        const userID = req.body.userID;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }
        if (!address) {
            return res.status(400).json({ success: false, message: 'Address is required' });
        }


        let subtotal = 0;
        for (const item of items) {
            if (!item.productId || !item.quantity || !item.color) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must include productId, color, and quantity'
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


        const merchantTransactionId = 'MT' + Date.now();


        const newOrder = await orderModel.create({
            userID,
            items,
            amount: totalAmount,
            address,
            status: 'Order Placed',
            payment: false,
            paymentMethod: 'PHONEPE',
            phonePeTxnId: merchantTransactionId,
            date: Date.now()
        });


        const redirectUrl = `${BACKEND_URL}/api/payment/phonepe/callback?orderId=${newOrder._id}&merchantTransactionId=${merchantTransactionId}`;
        const callbackUrl = redirectUrl;


        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId,
            merchantUserId: userID,
            amount: Math.round(totalAmount * 100),
            redirectUrl,
            redirectMode: 'POST',
            callbackUrl,
            paymentInstrument: { type: 'PAY_PAGE' }
        };

        const data = Buffer.from(JSON.stringify(payload)).toString('base64');
        const path = '/pg/v1/pay';
        const xVerify = buildXVerify(data, path);

        const phonepeRes = await axios.post(
            `${PHONEPE_BASE_URL}${path}`,
            { request: data },
            { headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify } }
        );

        const pp = phonepeRes.data;
        const url = pp?.data?.instrumentResponse?.redirectInfo?.url;

        if (pp?.success === true && url) {
            return res.status(200).json({
                success: true,
                redirectUrl: url,
                merchantTransactionId,
                orderId: newOrder._id,
                amount: totalAmount
            });
        } else {
            return res.status(500).json({
                success: false,
                message: pp?.message || 'Failed to initiate PhonePe payment'
            });
        }
    } catch (err) {
        console.error('PhonePe initiate error:', err.response?.data || err.message);
        return res.status(500).json({
            success: false,
            message: err.response?.data?.message || err.message
        });
    }
};


export const phonePeCallback = async (req, res) => {
    try {
        const { orderId, merchantTransactionId } = { ...req.query, ...req.body };

        const path = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
        const xVerify = buildXVerify('', path);

        const statusRes = await axios.get(`${PHONEPE_BASE_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': MERCHANT_ID
            }
        });

        const data = statusRes.data;

        if (data?.success === true && data?.code === 'PAYMENT_SUCCESS') {
            await orderModel.findOneAndUpdate(
                { _id: orderId, phonePeTxnId: merchantTransactionId },
                { payment: true, status: 'Order Placed' }
            );
            return res.redirect(`${FRONTEND_URL}/orders?payment=success`);
        } else {
            await orderModel.findByIdAndUpdate(orderId, { payment: false });
            return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
        }
    } catch (err) {
        console.error('PhonePe callback error:', err.response?.data || err.message);
        return res.redirect(`${FRONTEND_URL}/orders?payment=failed`);
    }
};


export const phonePeStatus = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;
        const path = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
        const xVerify = buildXVerify('', path);

        const statusRes = await axios.get(`${PHONEPE_BASE_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': MERCHANT_ID
            }
        });

        const data = statusRes.data;

        if (data?.success === true && data?.code === 'PAYMENT_SUCCESS') {
            await orderModel.findOneAndUpdate(
                { phonePeTxnId: merchantTransactionId },
                { payment: true }
            );
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('PhonePe status error:', err.response?.data || err.message);
        return res.status(500).json({
            success: false,
            message: err.response?.data?.message || err.message
        });
    }
};
