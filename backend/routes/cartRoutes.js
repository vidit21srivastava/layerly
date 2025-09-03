import express from 'express'
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js'

const cartRouter = express.Router();

cartRouter.get('/get', getUserCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update', updateCart);

export default cartRouter;
