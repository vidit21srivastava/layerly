import userModel from "../models/userModel.js";

// FUNCTION TO ADD PRODUCTS TO USER CART
const addToCart = async (req, res) => {
    try {
        const { userID, itemId, color, quantity = 1 } = req.body;

        if (!itemId || !color) {
            return res.status(400).json({
                success: false,
                message: "Item ID and color are required"
            });
        }

        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = user.cartData || {};

        // Add to cart
        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += parseInt(quantity);
            } else {
                cartData[itemId][color] = parseInt(quantity);
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][color] = parseInt(quantity);
        }

        await userModel.findByIdAndUpdate(userID, { cartData });

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully"
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FUNCTION TO UPDATE USER CART
const updateCart = async (req, res) => {
    try {
        const { userID, itemId, color, quantity } = req.body;

        if (!itemId || !color || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Item ID, color, and quantity are required"
            });
        }

        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = user.cartData || {};

        if (parseInt(quantity) <= 0) {

            if (cartData[itemId]) {
                delete cartData[itemId][color];


                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {

            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }
            cartData[itemId][color] = parseInt(quantity);
        }

        await userModel.findByIdAndUpdate(userID, { cartData });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully"
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FUNCTION TO GET USER CART DATA
const getUserCart = async (req, res) => {
    try {
        const { userID } = req.body;

        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            cartData: user.cartData || {}
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { addToCart, updateCart, getUserCart };
