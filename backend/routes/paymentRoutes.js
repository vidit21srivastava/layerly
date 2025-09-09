import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { initiatePhonePe, phonePeCallback } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

// Start payment
paymentRouter.post('/phonepe/initiate', userAuth, initiatePhonePe);

// Redirect/callback from PhonePe
paymentRouter.post('/phonepe/callback', phonePeCallback);
paymentRouter.get('/phonepe/callback', phonePeCallback);


export default paymentRouter;
