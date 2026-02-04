import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// ADD PRODUCT FUNCTION
const addProduct = async (req, res) => {
    try {
        const {
            productID,
            name,
            description,
            price,
            category,
            bestseller,
            availableColors,
            date
        } = req.body || {};

        if (!productID || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const colors = ['white', 'black', 'gray', 'red', 'orange'];
        const imagesByColor = new Map();


        for (const color of colors) {
            if (req.files && req.files[`image_${color}`] && req.files[`image_${color}`][0]) {
                try {
                    const file = req.files[`image_${color}`][0];

                    const uploaded = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                        use_filename: true,
                        unique_filename: false
                    });
                    imagesByColor.set(
                        color.charAt(0).toUpperCase() + color.slice(1),
                        uploaded.secure_url
                    );
                } catch (uploadError) {
                    console.error(`Upload error for color ${color}:`, uploadError);
                }
            }
        }

        let colorArray = [];
        try {
            colorArray = JSON.parse(availableColors);
        } catch (e) {
            console.error("Error parsing availableColors:", e);
            colorArray = [];
        }

        const newProduct = new Product({
            productID,
            name,
            description,
            price: Number(price),
            imagesByColor,
            availableColors: colorArray,
            category,
            date: date ? new Date(date) : Date.now(),
            bestseller: bestseller === 'true' ? true : false
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            id: newProduct.id
        });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT FUNCTION
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            productID,
            name,
            description,
            price,
            category,
            bestseller,
            availableColors,
            date
        } = req.body || {};


        const updateData = {};

        if (productID !== undefined) updateData.productID = productID;
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (category !== undefined) updateData.category = category;
        if (date !== undefined) updateData.date = new Date(date);
        if (bestseller !== undefined) updateData.bestseller = bestseller === 'true' ? true : false;


        if (availableColors !== undefined) {
            let colorArray = [];
            try {
                colorArray = JSON.parse(availableColors);
                updateData.availableColors = colorArray;
            } catch (e) {
                console.error("Error parsing availableColors:", e);
                return res.status(400).json({
                    success: false,
                    message: "Invalid availableColors format"
                });
            }
        }

        const colors = ['white', 'black', 'gray', 'red', 'orange'];
        const newImagesByColor = new Map(existingProduct.imagesByColor);

        for (const color of colors) {
            if (req.files && req.files[`image_${color}`] && req.files[`image_${color}`][0]) {
                try {
                    const file = req.files[`image_${color}`][0];

                    const uploaded = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                        use_filename: true,
                        unique_filename: false
                    });


                    newImagesByColor.set(
                        color.charAt(0).toUpperCase() + color.slice(1),
                        uploaded.secure_url
                    );

                    console.log(`Updated image for color ${color}: ${uploaded.secure_url}`);
                } catch (uploadError) {
                    console.error(`Upload error for color ${color}:`, uploadError);
                    return res.status(500).json({
                        success: false,
                        message: `Failed to upload image for color ${color}`
                    });
                }
            }
        }


        if (newImagesByColor.size > 0) {
            updateData.imagesByColor = newImagesByColor;
        }


        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// LIST PRODUCT FUNCTION
const listProduct = async (req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        });
        res.removeHeader('ETag');
        res.removeHeader('Last-Modified');

        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// REMOVE PRODUCT FUNCTION
const removeProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SINGLE PRODUCT INFO FUNCTION
const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, updateProduct, listProduct, removeProduct, singleProduct };
