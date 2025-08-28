import { v2 as cloudinary } from 'cloudinary';
import productModel from '../schema/productModel.js';
import fs from 'fs';

// ADD PRODUCT FUNCTION
const addProduct = async (req, res) => {
    try {
        const {
            id,
            name,
            description,
            price,
            category,
            availableColors,
            bestseller
        } = req.body;

        const existingProduct = await productModel.findById(id);
        if (existingProduct) {
            return res.json({
                success: false,
                message: "Product with this ID already exists"
            });
        }

        const imagesByColor = new Map();

        const colorImages = req.files;

        for (const [fieldName, fileArray] of Object.entries(colorImages)) {
            const file = fileArray[0];
            const color = fieldName.replace('image_', '');

            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'layerly_products'
                });
                imagesByColor.set(color, result.secure_url);

                // Delete local file after upload
                fs.unlinkSync(file.path);
            } catch (uploadError) {
                console.error(`Error uploading ${color} image:`, uploadError);
            }
        }

        const newProduct = new productModel({
            _id: id,
            name,
            description,
            price: Number(price),
            imagesByColor,
            availableColors: JSON.parse(availableColors || '[]'),
            category,
            bestseller: bestseller === 'true',
            date: new Date()
        });

        await newProduct.save();

        res.json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// LIST PRODUCT FUNCTION
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});

        const productsWithImages = products.map(product => ({
            ...product.toObject(),
            imagesByColor: Object.fromEntries(product.imagesByColor)
        }));

        res.json({
            success: true,
            products: productsWithImages
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// REMOVE PRODUCT FUNCTION
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete images from Cloudinary
        for (const [color, imageUrl] of product.imagesByColor.entries()) {
            try {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`layerly_products/${publicId}`);
            } catch (deleteError) {
                console.error(`Error deleting ${color} image:`, deleteError);
            }
        }

        await productModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product removed successfully"
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// SINGLE PRODUCT INFO FUNCTION
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        const productWithImages = {
            ...product.toObject(),
            imagesByColor: Object.fromEntries(product.imagesByColor)
        };

        res.json({
            success: true,
            product: productWithImages
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

export { addProduct, listProduct, removeProduct, singleProduct };






