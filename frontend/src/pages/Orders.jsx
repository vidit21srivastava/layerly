import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext';

const Orders = () => {
    const { products, currency } = useContext(ShopContext);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Sample order data based on your product structure
    // Replace this with real order data from your backend
    const sampleOrders = [
        {
            id: "ORD-2025-001",
            date: "2025-08-20",
            status: "Delivered",
            deliveryFee: 60,
            items: [
                {
                    productId: "1",
                    color: "Black",
                    quantity: 1,
                    priceAtTime: 499
                }
            ]
        },
        {
            id: "ORD-2025-002",
            date: "2025-08-18",
            status: "Shipped",
            deliveryFee: 60,
            items: [
                {
                    productId: "1",
                    color: "Red",
                    quantity: 2,
                    priceAtTime: 499
                }
            ]
        },
        {
            id: "ORD-2025-003",
            date: "2025-08-15",
            status: "Processing",
            deliveryFee: 60,
            items: [
                {
                    productId: "1",
                    color: "White",
                    quantity: 1,
                    priceAtTime: 499
                }
            ]
        }
    ];

    // Helper function to get product details by ID
    const getProductById = (productId) => {
        return products.find(product => product.id === productId);
    };

    // Calculate order totals
    const calculateOrderTotal = (order) => {
        const subtotal = order.items.reduce((sum, item) => {
            return sum + (item.priceAtTime * item.quantity);
        }, 0);
        return subtotal + order.deliveryFee;
    };

    const calculateSubtotal = (order) => {
        return order.items.reduce((sum, item) => {
            return sum + (item.priceAtTime * item.quantity);
        }, 0);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getColorHex = (colorName) => {
        const colorMap = {
            'Black': '#000000',
            'Gray': '#6B7280',
            'Red': '#EF4444',
            'Orange': '#F97316',
            'White': '#FFFFFF'
        }
        return colorMap[colorName] || '#000000'
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(selectedOrder?.id === order.id ? null : order);
    };

    const handleReorder = (orderItems) => {
        // Add all items from the order back to cart
        // You can implement this using your addToCart function
        orderItems.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                // addToCart(item.productId, item.color, item.quantity);
                console.log(`Reordering: ${product.name} (${item.color}) x ${item.quantity}`);
            }
        });
    };

    if (sampleOrders.length === 0) {
        return (
            <div className='pt-3 md:pt-10 border-t border-t-gray-300'>
                <div className='text-left py-2 text-xl mb-8'>
                    <h1 className='delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700'>
                        YOUR ORDERS
                    </h1>
                    <hr className='w-14 border-none h-[2px] sm:h-[2px] bg-gray-500' />
                </div>

                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>📦</div>
                    <h2 className='text-xl text-gray-600 mb-2'>No orders yet</h2>
                    <p className='text-gray-500 mb-6'>When you place an order, it will appear here</p>
                    <a
                        href="/collection"
                        className='inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition-colors duration-200'
                    >
                        Start Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
            <div className='mb-6'>
                <h1 className='delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700'>
                    YOUR ORDERS
                </h1>
                <hr className='w-11 md:w-14  border-none h-[2px] sm:h-[2px] bg-gray-500 ml-19 md:ml-23 ' />
            </div>

            <div className='space-y-4 '>
                {sampleOrders.map((order) => {
                    const orderTotal = calculateOrderTotal(order);
                    const orderSubtotal = calculateSubtotal(order);
                    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                        <div key={order.id} className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
                            {/* Order Header */}
                            <div className='p-4 sm:p-6 border-b border-gray-100'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                    <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 text-sm sm:text-base'>
                                                Order #{order.id}
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
                                            {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details - Expanded */}
                            {selectedOrder?.id === order.id && (
                                <div className='p-4 sm:p-6 bg-gray-50'>
                                    <div className='space-y-4'>
                                        {/* Order Items */}
                                        <div>
                                            <h4 className='font-medium text-gray-900 mb-3 text-sm'>Order Items</h4>
                                            <div className='space-y-3'>
                                                {order.items.map((item, index) => {
                                                    const product = getProductById(item.productId);

                                                    if (!product) {
                                                        return (
                                                            <div key={index} className='bg-white p-3 rounded-lg'>
                                                                <p className='text-sm text-red-500'>Product not found</p>
                                                            </div>
                                                        );
                                                    }

                                                    const productImage = product.imagesByColor[item.color];
                                                    const itemTotal = item.priceAtTime * item.quantity;

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
                                                                    <span className='text-xs text-gray-500'>{currency}{item.priceAtTime} each</span>
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
                                            <div className='flex-1 md:flex-initial  sm:w-80 md:w-full bg-white p-4 rounded-lg'>
                                                <h4 className='font-medium text-gray-900 mb-3 text-sm'>Order Summary</h4>
                                                <div className='space-y-2'>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-gray-600'>Subtotal</span>
                                                        <span className='text-gray-900'>{currency}{orderSubtotal}</span>
                                                    </div>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-gray-600'>Delivery Fee</span>
                                                        <span className='text-gray-900'>{currency}{order.deliveryFee}</span>
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

                                                {(order.status === 'Shipped' || order.status === 'Processing') && (
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
