import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { initiatePhonePe, phonePeCallback } from '../controllers/paymentController.js';

const router = express.Router();

// Start payment
router.post('/phonepe/initiate', userAuth, initiatePhonePe);

// Redirect/callback from PhonePe
router.post('/phonepe/callback', phonePeCallback);
router.get('/phonepe/callback', phonePeCallback);

export default router;
