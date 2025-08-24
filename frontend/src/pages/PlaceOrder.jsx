import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
    const { currency, getCartAmount, delivery_fee, navigate } = useContext(ShopContext);
    const cartTotal = getCartAmount();
    const finalTotal = cartTotal > 0 ? cartTotal + delivery_fee : 0;

    return (
        <div className='border-t border-gray-300 pt-8 sm:pt-14 min-h-[48vh]'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto px-4'>

                {/* Left Section - Delivery Information */}
                <div className='flex-1 lg:flex-[2] max-w-none lg:max-w-2xl'>
                    <div className='mb-6'>
                        <h1 className='delius-unicase-regular text-lg sm:text-lg lg:text-xl font-normal text-gray-700'>
                            DELIVERY INFORMATION
                        </h1>
                        <hr className='w-16 border-none h-[2px] bg-gray-500 ml-42 md:ml-48' />
                    </div>

                    <div className='space-y-4'>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text'
                                placeholder='First Name' required
                            />
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text'
                                placeholder='Last Name' required
                            />
                        </div>

                        <input
                            className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='email'
                            placeholder='Email Address' required
                        />

                        <input
                            className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                            type='text'
                            placeholder='House No./Street' required
                        />

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text'
                                placeholder='City' required
                            />
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text'
                                placeholder='State' required
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='text'
                                placeholder='PIN Code'
                                maxLength='6' required
                            />
                            <input
                                className='border border-gray-300 rounded py-2.5 px-3.5 w-full focus:border-gray-500 focus:outline-none'
                                type='tel'
                                placeholder='Mobile No. (10-digits)'
                                maxLength='10' required
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section - Order Summary */}
                <div className='flex-1 lg:flex-[1]'>
                    <div className='lg:sticky lg:top-4'>
                        <div className='bg-gray-50 rounded-lg p-6 shadow-sm'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Final Summary</h2>

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

                            <button onClick={() => navigate('/orders')} className='w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-bold text-xl hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform'>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
