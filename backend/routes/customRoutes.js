import express from 'express';
import upload from '../middleware/multer.js';
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
    upload.single('model'),
    createCustomQuote
);

// Admin list
customRouter.get('/quotes', adminAuth, listCustomQuotes);

// Admin reply (sends email)
customRouter.post('/quote/:id/reply', adminAuth, replyToCustomQuote);

// Admin close
customRouter.post('/quote/:id/close', adminAuth, closeCustomQuote);

export default customRouter;
