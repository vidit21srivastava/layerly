import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { initiatePhonePe, phonePeCallback, checkPhonePeStatus } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

// Start payment
paymentRouter.post('/phonepe/initiate', userAuth, initiatePhonePe);

// Redirect/callback from PhonePe
paymentRouter.post('/phonepe/callback', phonePeCallback);
paymentRouter.get('/phonepe/callback', phonePeCallback);

// Manual status check (frontend can poll this)
paymentRouter.get('/phonepe/status/:merchantOrderId', userAuth, checkPhonePeStatus);

export default paymentRouter;
