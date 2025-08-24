import React, { useContext, useEffect, useState } from 'react';

import { ShopContext } from '../context/ShopContext';

const Cart = () => {
    const { products, currency, cartItems, updateCartItemQuantity, removeFromCart, getCartAmount, delivery_fee, navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);


    useEffect(() => {
        const tempData = [];
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    tempData.push({
                        id: items,
                        color: item,
                        quantity: cartItems[items][item]
                    })
                }
            }
        }
        setCartData(tempData);
    }, [cartItems])

    const getColorHex = (colorName) => {
        const colorMap = {
            'Black': '#000000',
            'Gray': '#6B7280',
            'Red': '#EF4444',
            'Orange': '#F97316',
            'White': '#FFFFFF'
        }
        return colorMap[colorName] || '#000000'
    }

    const handleQuantityChange = (id, color, change) => {
        const currentItem = cartData.find(item => item.id === id && item.color === color);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + change;
        updateCartItemQuantity(id, color, newQuantity);
    }

    const handleRemoveItem = (id, color) => {
        removeFromCart(id, color);
    }

    const cartTotal = getCartAmount();
    const finalTotal = cartTotal > 0 ? cartTotal + delivery_fee : 0;

    if (cartData.length === 0) {
        return (
            <div className='pt-3 md:pt-10 border-t border-t-gray-300'>
                <div className='text-left py-2 text-xl mb-8'>
                    <h1 className='delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700'>
                        YOUR CART
                    </h1>
                    <hr className='w-8 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-20' />
                </div>

                <div className='text-center py-12'>

                    <h2 className='text-2xl text-gray-600 mb-2'>Your cart is empty</h2>
                    <p className='text-xl text-gray-500'>Add some products to get started!</p>
                </div>
            </div>
        )
    }

    return (
        <div className='pt-3 md:pt-10 border-t border-t-gray-300'>
            <div className='text-left py-2 text-xl mb-8'>
                <h1 className='delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700'>
                    YOUR CART
                </h1>
                <hr className='w-8 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-20' />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Cart Items */}
                <div className='lg:col-span-2 space-y-4'>
                    {cartData.map((item, index) => {
                        const productData = products.find((product) => product.id === item.id);

                        if (!productData) return null;

                        const currentImage = productData.imagesByColor[item.color];
                        const itemTotal = productData.price * item.quantity;

                        return (
                            <div key={index} className='bg-white rounded-lg border border-gray-200 p-4 md:p-3 sm:p-6 hover:shadow-md transition-shadow duration-200'>
                                <div className='flex flex-row sm:flex-row gap-4'>
                                    {/* Product Image */}
                                    <div className='w-32 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0'>
                                        <img
                                            src={currentImage}
                                            alt={productData.name}
                                            className='w-full h-full object-cover'
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex flex-col sm:flex-row justify-between gap-4'>
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-2'>
                                                    {productData.name}
                                                </h3>

                                                <div className='flex items-center gap-2 mb-2'>
                                                    <span className='text-xs text-gray-500'>Color:</span>
                                                    <div className='flex items-center gap-1'>
                                                        <div
                                                            className='w-4 h-4 rounded-full border border-gray-300'
                                                            style={{ backgroundColor: getColorHex(item.color) }}
                                                        ></div>
                                                        <span className='text-xs text-gray-600'>{item.color}</span>
                                                    </div>
                                                </div>

                                                <p className='text-xs text-gray-500 mb-3'>{productData.category}</p>

                                                <div className='flex flex-col md:flex-row items-end md:items-center justify-between gap-4'>
                                                    <div className='text-base font-semibold text-gray-900'>
                                                        {currency}{productData.price}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className='flex items-center gap-3'>
                                                        <div className='flex items-center bg-gray-100 rounded-lg p-1'>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.color, -1)}
                                                                className='w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 active:scale-95 transform'
                                                            >
                                                                <span className='text-gray-600 font-medium text-lg leading-none'>−</span>
                                                            </button>

                                                            <span className='text-sm font-medium text-gray-900 min-w-[2rem] text-center px-2'>
                                                                {item.quantity}
                                                            </span>

                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.color, 1)}
                                                                className='w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 active:scale-95 transform'
                                                            >
                                                                <span className='text-gray-600 font-medium text-lg leading-none'>+</span>
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemoveItem(item.id, item.color)}
                                                            className='text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200'
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Total - Desktop */}
                                            <div className='hidden sm:flex flex-row items-start justify-between'>
                                                <div className='text-sm text-gray-500 mt-0.5'>Item Total:</div>
                                                <div className='text-base font-semibold text-gray-900 mx-2'>
                                                    {currency}{itemTotal}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Total - Mobile */}
                                        <div className='flex sm:hidden justify-between items-center mt-3 pt-3 border-t border-gray-100'>
                                            <span className='text-sm text-gray-500'>Item Total:</span>
                                            <span className='text-base font-semibold text-gray-900'>
                                                {currency}{itemTotal}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className='lg:col-span-1'>
                    <div className='bg-gray-50 rounded-lg p-6 sticky top-4'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Order Summary</h2>

                        <div className='space-y-3 mb-4'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-600'>Subtotal</span>
                                <span className='text-gray-900'>{currency}{cartTotal}</span>
                            </div>

                            <div className='flex justify-between text-sm'>
                                <span className='text-gray-600'>Delivery Fee</span>
                                <span className='text-gray-900'>{currency}{delivery_fee}</span>
                            </div>

                            <hr className='border-gray-200' />

                            <div className='flex justify-between font-semibold text-base'>
                                <span className='text-gray-900'>Total</span>
                                <span className='text-gray-900'>{currency}{finalTotal}</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/place-order')} className='w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-400 transition-colors duration-200 active:scale-95 transform'>
                            Proceed to Checkout
                        </button>

                        <div className='mt-4 text-center'>
                            <a href="/catalogue" className='text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200'>
                                ← Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
