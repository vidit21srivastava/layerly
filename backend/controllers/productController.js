import Product from '../models/productModel.js';

// ADD PRODUCT FUNCTION
const addProduct = async (req, res) => {
    console.log("=== REQUEST DEBUG ===");
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("===================");

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
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const colors = ['white', 'black', 'gray', 'red', 'orange'];
        const imagesByColor = new Map();

        colors.forEach(color => {
            if (req.files && req.files[`image_${color}`] && req.files[`image_${color}`][0]) {
                imagesByColor.set(
                    color.charAt(0).toUpperCase() + color.slice(1),
                    req.files[`image_${color}`][0].path
                );
            }
        });

        // Parse availableColors if it's a JSON string
        let colorArray = [];
        if (availableColors) {
            colorArray = typeof availableColors === 'string'
                ? JSON.parse(availableColors)
                : availableColors;
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
            bestseller: bestseller === 'true' || bestseller === true
        });

        await newProduct.save();
        res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// LIST PRODUCT FUNCTION


const listProduct = async (req, res) => {

}

// REMOVE PRODUCT FUNCTION


const removeProduct = async (req, res) => {

}

// SINGLE PRODUCT INFO FUNCTION


const singleProduct = async (req, res) => {

}

export { addProduct, listProduct, removeProduct, singleProduct };

