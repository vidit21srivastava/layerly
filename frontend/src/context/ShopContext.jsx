import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 60;
    const [search, setSearch] = useState('');
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    const addToCart = async (itemId, color, quantity = 1) => {
        let cartData = structuredClone(cartItems);

        // Find the product for toast notification
        const product = products.find(p => p.id === itemId);
        const productName = product ? product.name : 'Item';

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += quantity;
            } else {
                cartData[itemId][color] = quantity;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][color] = quantity;
        }

        setCartItems(cartData);

        toast.success(`${productName} (${color}) added to cart!`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
            draggable: true,
        });
    }

    const updateCartItemQuantity = async (itemId, color, quantity) => {
        let cartData = structuredClone(cartItems);

        // Find the product for toast notification
        const product = products.find(p => p.id === itemId);
        const productName = product ? product.name : 'Item';

        // Get previous quantity
        const previousQuantity = cartData[itemId] ? (cartData[itemId][color] || 0) : 0;

        if (quantity <= 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][color];

                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }

            if (previousQuantity > 0) {
                toast.error(`${productName} (${color}) removed from cart!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "colored",
                    draggable: true,
                });
            }
        } else {
            if (cartData[itemId]) {
                cartData[itemId][color] = quantity;
            }

            if (previousQuantity !== quantity && previousQuantity > 0) {
                toast.info(`${productName} (${color}) quantity updated to ${quantity}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: "colored",
                    draggable: true,
                });
            }
        }

        setCartItems(cartData);
    }

    const removeFromCart = async (itemId, color) => {
        let cartData = structuredClone(cartItems);

        // Find the product for toast notification
        const product = products.find(p => p.id === itemId);
        const productName = product ? product.name : 'Item';

        if (cartData[itemId] && cartData[itemId][color]) {
            delete cartData[itemId][color];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }

            toast.error(`${productName} (${color}) removed from cart!`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
                draggable: true,
            });
        }

        setCartItems(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                totalCount += cartItems[items][item];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product.id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }
        return totalAmount;
    }

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, cartItems, addToCart,
        updateCartItemQuantity, removeFromCart,
        getCartCount, getCartAmount, navigate
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
