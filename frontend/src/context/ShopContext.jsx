import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 60;
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const [search, setSearch] = useState('');
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();


    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${backendURL}/api/product/list`);
            if (res.data.success) {

                const normalized = (res.data.products || []).map(p => ({
                    id: p._id,
                    productID: p.productID,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    imagesByColor: p.imagesByColor || {},
                    availableColors: p.availableColors || ['White', 'Black', 'Gray', 'Red', 'Orange'],
                    category: p.category,
                    date: p.date,
                    bestseller: !!p.bestseller
                }));
                setProducts(normalized);
            }
        } catch (err) {
            console.error('Fetch products error:', err);
            toast.error('Failed to load products');
        }
    };


    useEffect(() => {
        fetchProducts();
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            getUserProfile(savedToken);
        }
    }, []);


    const getUserProfile = async (authToken = token) => {
        try {
            if (!authToken) return;
            const response = await axios.get(`${backendURL}/api/user/profile`, {
                headers: { token: authToken }
            });
            if (response.data.success) {
                setUser(response.data.user);
                // Load cart data
                getUserCart(authToken);
            }
        } catch (error) {
            console.error('Get profile error:', error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    };


    const getUserCart = async (authToken = token) => {
        try {
            if (!authToken) return;
            const response = await axios.get(`${backendURL}/api/cart/get`, {
                headers: { token: authToken }
            });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error('Get cart error:', error);
        }
    };


    const findProductById = (id) => products.find(p => p.id === id);

    const addToCart = async (itemId, color, quantity = 1) => {
        if (!token) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }
        try {
            const response = await axios.post(`${backendURL}/api/cart/add`, {
                itemId,
                color,
                quantity
            }, {
                headers: { token }
            });
            if (response.data.success) {

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

                const product = findProductById(itemId);
                const productName = product ? product.name : 'Item';
                toast.success(`${productName} (${color}) added to cart!`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('Failed to add item to cart');
        }
    };


    const updateCartItemQuantity = async (itemId, color, quantity) => {
        if (!token) {
            toast.error('Please login to update cart');
            return;
        }
        try {
            const response = await axios.put(`${backendURL}/api/cart/update`, {
                itemId,
                color,
                quantity
            }, {
                headers: { token }
            });
            if (response.data.success) {

                let cartData = structuredClone(cartItems);
                if (quantity <= 0) {
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
                    cartData[itemId][color] = quantity;
                }
                setCartItems(cartData);

                const product = findProductById(itemId);
                const productName = product ? product.name : 'Item';
                if (quantity <= 0) {
                    toast.error(`${productName} (${color}) removed from cart!`);
                } else {
                    toast.info(`${productName} (${color}) quantity updated to ${quantity}`);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Update cart error:', error);
            toast.error('Failed to update cart');
        }
    };


    const removeFromCart = async (itemId, color) => {
        await updateCartItemQuantity(itemId, color, 0);
    };


    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                totalCount += cartItems[items][item];
            }
        }
        return totalCount;
    };


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = findProductById(items);
            if (itemInfo) {
                for (const color in cartItems[items]) {
                    totalAmount += itemInfo.price * cartItems[items][color];
                }
            }
        }
        return totalAmount;
    };


    const login = (authToken, userData = null) => {
        setToken(authToken);
        localStorage.setItem('token', authToken);
        if (userData) {
            setUser(userData);
            getUserCart(authToken);
        } else {
            getUserProfile(authToken);
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        setCartItems({});
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/');
    };

    const value = useMemo(() => ({
        products,
        currency,
        delivery_fee,
        backendURL,
        search,
        setSearch,
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        getCartCount,
        getCartAmount,
        navigate,
        token,
        user,
        login,
        logout,
        getUserProfile,
        getUserCart,
    }), [products, currency, delivery_fee, backendURL, search, cartItems, token, user]);

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
