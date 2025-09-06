import React, { useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
    const { products, currency, token, backendURL, navigate, addToCart } = useContext(ShopContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const payment = searchParams.get('payment');
        if (payment === 'success') {
            toast.success('Payment successful! Your order has been placed.');
        } else if (payment === 'failed') {
            toast.error('Payment failed or cancelled.');
        }
    }, [searchParams]);


    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        fetchOrders()
    }, [token])

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/order/userorders`, {
                headers: { token }
            })

            if (response.data.success) {
                setOrders(response.data.orders)
            }
        } catch (error) {
            console.error('Fetch orders error:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            } else {
                toast.error('Failed to fetch orders')
            }
        } finally {
            setLoading(false)
        }
    }


    const getProductById = (productId) => {
        return products.find(product => product.id === productId)
    }

    const calculateOrderTotal = (order) => {
        return order.amount
    }

    const calculateSubtotal = (order) => {
        return order.amount - 60 // Assuming delivery fee is 60
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'order placed':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleViewDetails = (order) => {
        setSelectedOrder(selectedOrder?._id === order._id ? null : order)
    }

    const handleReorder = async (orderItems) => {
        try {
            for (const item of orderItems) {
                const product = getProductById(item.productId || item._id)
                if (product) {
                    await addToCart(item.productId || item._id, item.color, item.quantity)
                }
            }
            toast.success('Items added to cart!')
        } catch (error) {
            toast.error('Failed to add items to cart')
        }
    }

    if (!token) {
        return (
            <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
                <div className='text-center py-12'>
                    <h2 className='text-2xl text-gray-600 mb-4'>Please login to view your orders</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors'
                    >
                        Login
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
                <div className='text-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading your orders...</p>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
                <div className='mb-6'>
                    <h1 className='delius-unicase-regular text-lg sm:text-lg lg:text-xl font-normal text-gray-700'>
                        YOUR ORDERS
                    </h1>
                    <hr className='w-12 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-21 md:ml-24' />
                </div>

                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>📦</div>
                    <h2 className='text-xl text-gray-600 mb-2'>No orders yet</h2>
                    <p className='text-gray-500 mb-6'>When you place an order, it will appear here</p>
                    <button
                        onClick={() => navigate('/catalogue')}
                        className='bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition-colors'
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
            <div className='mb-6'>
                <h1 className='delius-unicase-regular text-lg sm:text-lg lg:text-xl font-normal text-gray-700'>
                    YOUR ORDERS
                </h1>
                <hr className='w-12 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-21 md:ml-24' />
            </div>

            <div className='space-y-4'>
                {orders.map((order) => {
                    const orderTotal = calculateOrderTotal(order)
                    const orderSubtotal = calculateSubtotal(order)
                    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

                    return (
                        <div key={order._id} className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
                            {/* Order Header */}
                            <div className='p-4 sm:p-6 border-b border-gray-100'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                    <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 text-sm sm:text-base'>
                                                Order #{order._id.slice(-8)}
                                            </h3>
                                            <p className='text-xs sm:text-sm text-gray-500'>
                                                Placed on {formatDate(order.date)}
                                            </p>
                                        </div>

                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <div className='text-right'>
                                            <p className='font-semibold text-gray-900 text-sm sm:text-base'>
                                                {currency}{orderTotal}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {totalItems} item{totalItems > 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className='text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200'
                                        >
                                            {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details - Expanded */}
                            {selectedOrder?._id === order._id && (
                                <div className='p-4 sm:p-6 bg-gray-50'>
                                    <div className='space-y-4'>
                                        {/* Order Items */}
                                        <div>
                                            <h4 className='font-medium text-gray-900 mb-3 text-sm'>Order Items</h4>
                                            <div className='space-y-3'>
                                                {order.items.map((item, index) => {
                                                    const product = getProductById(item.productId || item._id)

                                                    if (!product) {
                                                        return (
                                                            <div key={index} className='bg-white p-3 rounded-lg'>
                                                                <p className='text-sm text-red-500'>Product not found</p>
                                                            </div>
                                                        )
                                                    }

                                                    const productImage = product.imagesByColor[item.color]
                                                    const itemTotal = (item.price || product.price) * item.quantity

                                                    return (
                                                        <div key={index} className='flex items-center gap-3 bg-white p-3 rounded-lg'>
                                                            <div className='w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0'>
                                                                {productImage ? (
                                                                    <img
                                                                        src={productImage}
                                                                        alt={`${product.name} in ${item.color}`}
                                                                        className='w-full h-full object-cover'
                                                                        loading="lazy"
                                                                    />
                                                                ) : (
                                                                    <div className='w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'>
                                                                        <span className='text-xs text-gray-400'>No Image</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className='flex-1 min-w-0'>
                                                                <p className='text-sm font-medium text-gray-900 truncate'>{product.name}</p>
                                                                <p className='text-xs text-gray-500 mb-1'>{product.category}</p>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='flex items-center gap-1'>
                                                                        <div
                                                                            className='w-3 h-3 rounded-full border border-gray-300'
                                                                            style={{ backgroundColor: getColorHex(item.color) }}
                                                                        ></div>
                                                                        <span className='text-xs text-gray-500'>{item.color}</span>
                                                                    </div>
                                                                    <span className='text-xs text-gray-400'>•</span>
                                                                    <span className='text-xs text-gray-500'>Qty: {item.quantity}</span>
                                                                    <span className='text-xs text-gray-400'>•</span>
                                                                    <span className='text-xs text-gray-500'>{currency}{item.price || product.price} each</span>
                                                                </div>
                                                            </div>

                                                            <div className='text-sm font-medium text-gray-900'>
                                                                {currency}{itemTotal}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className='flex flex-col md:items-center md:flex-row gap-6 md:gap-8'>
                                            {/* Order Summary */}
                                            <div className='flex-1 md:flex-initial sm:w-80 md:w-full bg-white p-4 rounded-lg'>
                                                <h4 className='font-medium text-gray-900 mb-3 text-sm'>Order Summary</h4>
                                                <div className='space-y-2'>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-gray-600'>Subtotal</span>
                                                        <span className='text-gray-900'>{currency}{orderSubtotal}</span>
                                                    </div>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-gray-600'>Delivery Fee</span>
                                                        <span className='text-gray-900'>{currency}60</span>
                                                    </div>
                                                    <hr className='border-gray-200' />
                                                    <div className='flex justify-between font-medium'>
                                                        <span className='text-gray-900'>Total</span>
                                                        <span className='text-gray-900'>{currency}{orderTotal}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className='flex-1 md:flex-initial md:w-48 flex flex-col gap-3 justify-start'>
                                                {order.status === 'Delivered' && (
                                                    <button
                                                        onClick={() => handleReorder(order.items)}
                                                        className='w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-orange-400 transition-colors duration-200'
                                                    >
                                                        Reorder Items
                                                    </button>
                                                )}

                                                {(order.status === 'Shipped' || order.status === 'Processing' || order.status === 'Order Placed') && (
                                                    <button className='w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors duration-200'>
                                                        Track Order
                                                    </button>
                                                )}

                                                <button className='w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors duration-200'>
                                                    Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Orders
