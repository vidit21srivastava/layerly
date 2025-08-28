import { createContext, useEffect, useState } from "react";
import { products as localProducts } from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 60;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const [search, setSearch] = useState('');
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                // Fallback to local products if API fails
                setProducts(localProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Use local products as fallback
            setProducts(localProducts);
        }
    };

    // Load user data
    const loadUserData = async () => {
        if (!token) return;

        try {
            const response = await axios.get(backendUrl + '/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUserData(response.data.user);
                if (response.data.user.cartData) {
                    setCartItems(response.data.user.cartData);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Sync cart with backend
    const syncCart = async (cartData) => {
        if (!token) return;

        try {
            await axios.post(
                backendUrl + '/api/user/cart',
                { cartData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    const addToCart = async (itemId, color, quantity = 1) => {
        let cartData = structuredClone(cartItems);

        const product = products.find(p => p.id === itemId || p._id === itemId);
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
        await syncCart(cartData);

        toast.success(`${productName} (${color}) added to cart!`);
    }

    const updateCartItemQuantity = async (itemId, color, quantity) => {
        let cartData = structuredClone(cartItems);

        const product = products.find(p => p.id === itemId || p._id === itemId);
        const productName = product ? product.name : 'Item';

        const previousQuantity = cartData[itemId] ? (cartData[itemId][color] || 0) : 0;

        if (quantity <= 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][color];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }

            if (previousQuantity > 0) {
                toast.error(`${productName} (${color}) removed from cart!`);
            }
        } else {
            if (cartData[itemId]) {
                cartData[itemId][color] = quantity;
            }

            if (previousQuantity !== quantity && previousQuantity > 0) {
                toast.info(`${productName} (${color}) quantity updated to ${quantity}`);
            }
        }

        setCartItems(cartData);
        await syncCart(cartData);
    }

    const removeFromCart = async (itemId, color) => {
        let cartData = structuredClone(cartItems);

        const product = products.find(p => p.id === itemId || p._id === itemId);
        const productName = product ? product.name : 'Item';

        if (cartData[itemId] && cartData[itemId][color]) {
            delete cartData[itemId][color];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }

            toast.error(`${productName} (${color}) removed from cart!`);
        }

        setCartItems(cartData);
        await syncCart(cartData);
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
            let itemInfo = products.find((product) => product.id === items || product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }
        return totalAmount;
    }

    const logout = () => {
        setToken('');
        setUserData(null);
        setCartItems({});
        localStorage.removeItem('token');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        fetchProducts();
    }, []);

    // Load user data when token changes
    useEffect(() => {
        if (token) {
            loadUserData();
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee, backendUrl,
        search, setSearch, cartItems, addToCart,
        updateCartItemQuantity, removeFromCart,
        getCartCount, getCartAmount, navigate,
        token, setToken, userData, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
