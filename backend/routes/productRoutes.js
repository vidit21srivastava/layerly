import express from 'express';
import { listProduct, removeProduct, addProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

const uploadFields = [
    { name: 'image_White', maxCount: 1 },
    { name: 'image_Black', maxCount: 1 },
    { name: 'image_Gray', maxCount: 1 },
    { name: 'image_Red', maxCount: 1 },
    { name: 'image_Orange', maxCount: 1 }
];

productRouter.post('/add', adminAuth, upload.fields(uploadFields), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);

export default productRouter;
