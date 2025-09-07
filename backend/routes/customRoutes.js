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

customRouter.post(
    '/quote',
    (req, res, next) => {
        const token = req.headers.token;
        if (token) return userAuth(req, res, next);
        next();
    },
    createCustomQuote
);

customRouter.get('/quotes', adminAuth, listCustomQuotes);

customRouter.post('/quote/:id/reply', adminAuth, replyToCustomQuote);
customRouter.post('/quote/:id/close', adminAuth, closeCustomQuote);

customRouter.get('/proxy-stl', proxyStl);

export default customRouter;
