// backend/routes/customRoutes.js
import { proxyStl } from '../controllers/customController.js';
import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';
import {
    createCustomQuote,
    listCustomQuotes,
    replyToCustomQuote,
    closeCustomQuote
} from '../controllers/customController.js';

const customRouter = express.Router();

// Create quote — if token exists, attach userID; otherwise allow anonymous
customRouter.post(
    '/quote',
    (req, res, next) => {
        const token = req.headers.token;
        if (token) return userAuth(req, res, next);
        next();
    },
    createCustomQuote
);

// Admin list
customRouter.get('/quotes', adminAuth, listCustomQuotes);

// Admin reply (sends email)
customRouter.post('/quote/:id/reply', adminAuth, replyToCustomQuote);

// Admin close
customRouter.post('/quote/:id/close', adminAuth, closeCustomQuote);

// Public STL proxy (no auth)
customRouter.get('/proxy-stl', proxyStl);

export default customRouter;
