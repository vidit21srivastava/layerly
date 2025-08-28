import express from 'express';
import upload from '../middleware/multer.js';
import {
    addProduct,
    listProduct,
    removeProduct,
    singleProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post(
    '/add',
    upload.fields([
        { name: 'image_white', maxCount: 1 },
        { name: 'image_black', maxCount: 1 },
        { name: 'image_gray', maxCount: 1 },
        { name: 'image_red', maxCount: 1 },
        { name: 'image_orange', maxCount: 1 }
    ]),
    addProduct
);

router.get('/list', listProduct);
router.get('/single/:id', singleProduct);
router.delete('/remove/:id', removeProduct);

export default router;
