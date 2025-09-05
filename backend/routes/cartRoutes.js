import express from 'express';
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import userAuth from '../middleware/userAuth.js';

const cartRouter = express.Router();

cartRouter.get('/get', userAuth, getUserCart);
cartRouter.post('/add', userAuth, addToCart);
cartRouter.put('/update', userAuth, updateCart);

export default cartRouter;
