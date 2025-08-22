import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 60;
    const [search, setSearch] = useState('');
    const [cartItems, setCartItems] = useState({});

    const addToCart = async (itemId, color, quantity = 1) => {


        let cartData = structuredClone(cartItems);

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
    }

    const updateCartItemQuantity = async (itemId, color, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {

            if (cartData[itemId]) {
                delete cartData[itemId][color];

                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {

            if (cartData[itemId]) {
                cartData[itemId][color] = quantity;
            }
        }
        setCartItems(cartData);
    }

    const removeFromCart = async (itemId, color) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId] && cartData[itemId][color]) {
            delete cartData[itemId][color];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
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
            let itemInfo = products.find((product) => product._id === items);
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
        getCartCount, getCartAmount
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
