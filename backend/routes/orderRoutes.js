import express from 'express';
import { placeOrderPhonepe, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features 
orderRouter.post('/phonepe', userAuth, placeOrderPhonepe);

// User Features
orderRouter.get('/userorders', userAuth, userOrders);

export default orderRouter;
