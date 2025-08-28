import express from 'express';
import { listProduct, removeProduct, addProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

productRouter.post(
    '/add',
    upload.fields([
        { name: 'image_white', maxCount: 1 },
        { name: 'image_black', maxCount: 1 },
        { name: 'image_gray', maxCount: 1 },
        { name: 'image_red', maxCount: 1 },
        { name: 'image_orange', maxCount: 1 }
    ]), addProduct);

productRouter.post('/remove', removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);

export default productRouter;