import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

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
        phone: '',
        instruction: ''
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
                    phone: formData.phone,
                    instruction: formData.instruction
                }
            };


            const response = await axios.post(`${backendURL}/api/payment/phonepe/initiate`, orderData, {
                headers: { token }
            });

            if (response.data.success && response.data.redirectUrl) {

                window.location.href = response.data.redirectUrl;
            } else {
                toast.error(response.data.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Initiate payment error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to initiate payment';
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

                    <form className='space-y-4'>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} placeholder='First Name' required />
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} placeholder='Last Name' />
                        </div>

                        <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='email' name='email' value={formData.email} onChange={handleInputChange} placeholder='Email Address' required />

                        <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='text' name='street' value={formData.street} onChange={handleInputChange} placeholder='House No./Street' required />

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='city' value={formData.city} onChange={handleInputChange} placeholder='City' required />
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='state' value={formData.state} onChange={handleInputChange} placeholder='State' required />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text' name='pinCode' value={formData.pinCode} onChange={handleInputChange}
                                placeholder='PIN Code' maxLength='6' pattern='\d{6}' required />
                            <input className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='tel' name='phone' value={formData.phone} onChange={handleInputChange}
                                placeholder='Mobile No. (10-digits)' maxLength='10' pattern='\d{10}' required />
                        </div>
                        <textarea className='border border-gray-300 rounded-lg py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            rows="2" maxLength="100" name='instruction' value={formData.instruction} onChange={handleInputChange} placeholder='Instruction for Custom Order (if any)' />

                    </form>
                </div>

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

                        <div className="mt-4">
                            <div className="flex flex-col md:flex-row md:items-center bg-white border-2 border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow gap-1 md:gap-4">
                                {/* PhonePe Header */}
                                <div className="flex items-center gap-3 mb-4 md:mb-0 md:flex-shrink-0">
                                    <img
                                        className="w-8 h-8"
                                        src={assets.PhonePe}
                                        alt="PhonePe"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Pay with PhonePe</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            Secured & instant payment
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <button
                                    type="submit"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className={`w-full md:flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${loading
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                        : 'bg-purple-800 text-white hover:bg-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay {currency}{finalTotal}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlaceOrder;
