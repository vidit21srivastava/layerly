import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const {
        currency,
        getCartAmount,
        delivery_fee,
        navigate,
        token,
        cartItems,
        products,
        backendURL
    } = useContext(ShopContext);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        phone: ''
    });

    const cartTotal = getCartAmount();
    const finalTotal = cartTotal > 0 ? cartTotal + delivery_fee : 0;

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token]);

    useEffect(() => {
        if (cartTotal === 0) navigate('/cart');
    }, [cartTotal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const validateForm = () => {
        const required = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'pinCode', 'phone'];
        for (const field of required) {
            if (!formData[field].trim()) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }
        if (!/^\d{6}$/.test(formData.pinCode)) {
            toast.error('PIN code must be 6 digits');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error('Phone number must be 10 digits');
            return false;
        }
        return true;
    };

    // Convert cart items to order format
    const getOrderItems = () => {
        const orderItems = [];
        for (const itemId in cartItems) {
            for (const color in cartItems[itemId]) {
                const quantity = cartItems[itemId][color];
                const product = products.find(p => p.id === itemId);
                if (product && quantity > 0) {
                    orderItems.push({
                        productId: itemId,
                        name: product.name,
                        color,
                        quantity,
                        price: product.price
                    });
                }
            }
        }
        return orderItems;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const orderData = {
                items: getOrderItems(),
                address: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                    phone: formData.phone
                },

                phonePeTxnId: null
            };

            const response = await axios.post(`${backendURL}/api/order/phonepe`, orderData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Order placed successfully!');
                navigate('/orders');
            } else {
                toast.error(response.data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Place order error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to place order';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token || cartTotal === 0) {
        return (
            <div className='pt-8 sm:pt-14 border-t border-t-gray-300 min-h-[40vh] flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600'></div>
            </div>
        );
    }

    return (
        <div className='border-t border-gray-300 pt-8 sm:pt-14 min-h-[48vh]'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto px-4'>
                {/* Left Section */}
                <div className='flex-1 lg:flex-[2] max-w-none lg:max-w-2xl'>
                    <div className='mb-6'>
                        <h1 className='delius-unicase-regular text-lg sm:text-lg lg:text-xl font-normal text-gray-700'>
                            DELIVERY INFORMATION
                        </h1>
                        <hr className='w-16 border-none h-[2px] bg-gray-500 ml-42 md:ml-48' />
                    </div>

                    <form onSubmit={handlePlaceOrder} className='space-y-4'>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} placeholder='First Name' required />
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} placeholder='Last Name' required />
                        </div>

                        <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='email' name='email' value={formData.email} onChange={handleInputChange} placeholder='Email Address' required />

                        <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='text' name='street' value={formData.street} onChange={handleInputChange} placeholder='House No./Street' required />

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='city' value={formData.city} onChange={handleInputChange} placeholder='City' required />
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='state' value={formData.state} onChange={handleInputChange} placeholder='State' required />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='pinCode' value={formData.pinCode} onChange={handleInputChange}
                                placeholder='PIN Code' maxLength='6' pattern='\d{6}' required />
                            <input className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='tel' name='phone' value={formData.phone} onChange={handleInputChange}
                                placeholder='Mobile No. (10-digits)' maxLength='10' pattern='\d{10}' required />
                        </div>

                        {/* PhonePe only */}
                        <div className='mt-4'>
                            <div className='p-3 border border-gray-300 rounded-lg bg-white'>
                                <p className='font-medium text-gray-900'>PhonePe Payment</p>
                                <p className='text-sm text-gray-600'>Secure online payment with PhonePe</p>
                            </div>
                        </div>

                        <button type='submit' disabled={loading}
                            className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-xl transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                            {loading ? 'Placing Order...' : `Pay ${currency}${finalTotal} with PhonePe`}
                        </button>
                    </form>
                </div>

                {/* Right Section - Order Summary */}
                <div className='flex-1 lg:flex-[1]'>
                    <div className='lg:sticky lg:top-4'>
                        <div className='bg-gray-50 rounded-lg p-6 shadow-sm'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Order Summary</h2>

                            <div className='max-h-64 overflow-y-auto mb-4'>
                                {Object.keys(cartItems).map(itemId => {
                                    const product = products.find(p => p.id === itemId);
                                    if (!product) return null;
                                    return Object.keys(cartItems[itemId]).map(color => {
                                        const quantity = cartItems[itemId][color];
                                        if (quantity <= 0) return null;
                                        const itemTotal = product.price * quantity;
                                        return (
                                            <div key={`${itemId}-${color}`} className='flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0'>
                                                <div className='flex items-center gap-3'>
                                                    <img src={product.imagesByColor[color]} alt={product.name} className='w-12 h-12 object-cover rounded' />
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-900 truncate max-w-32'>{product.name}</p>
                                                        <p className='text-xs text-gray-600'>{color} × {quantity}</p>
                                                    </div>
                                                </div>
                                                <p className='text-sm font-medium text-gray-900'>{currency}{itemTotal}</p>
                                            </div>
                                        );
                                    });
                                })}
                            </div>

                            <div className='space-y-4 mb-6'>
                                <div className='flex justify-between items-center text-base'>
                                    <span className='text-gray-600'>Subtotal</span>
                                    <span className='text-gray-900 font-medium'>{currency}{cartTotal}</span>
                                </div>
                                <div className='flex justify-between items-center text-base'>
                                    <span className='text-gray-600'>Delivery Fee</span>
                                    <span className='text-gray-900 font-medium'>{currency}{delivery_fee}</span>
                                </div>
                                <hr className='border-gray-200' />
                                <div className='flex justify-between items-center text-lg'>
                                    <span className='text-gray-900 font-semibold'>Total</span>
                                    <span className='text-gray-900 font-semibold'>{currency}{finalTotal}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
