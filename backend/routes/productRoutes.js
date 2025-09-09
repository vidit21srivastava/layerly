import express from 'express';
import upload from '../middleware/multer.js';
import {
    addProduct,
    updateProduct,
    listProduct,
    removeProduct,
    singleProduct
} from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post(
    '/add', adminAuth,
    upload.fields([
        { name: 'image_white', maxCount: 1 },
        { name: 'image_black', maxCount: 1 },
        { name: 'image_gray', maxCount: 1 },
        { name: 'image_red', maxCount: 1 },
        { name: 'image_orange', maxCount: 1 }
    ]),
    addProduct
);

productRouter.put(
    '/update/:id', adminAuth,
    upload.fields([
        { name: 'image_white', maxCount: 1 },
        { name: 'image_black', maxCount: 1 },
        { name: 'image_gray', maxCount: 1 },
        { name: 'image_red', maxCount: 1 },
        { name: 'image_orange', maxCount: 1 }
    ]),
    updateProduct
);

productRouter.get('/list', listProduct);
productRouter.get('/single/:id', singleProduct);
productRouter.delete('/remove/:id', adminAuth, removeProduct);

export default productRouter;
