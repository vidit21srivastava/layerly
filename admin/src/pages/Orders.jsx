import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const Orders = ({ setToken }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${backendURL}/api/order/list`, {
                headers: { token }
            });
            if (res.data.success) {
                setOrders(res.data.orders || []);
            } else {
                toast.error(res.data.message || 'Failed to fetch orders');
            }
        } catch (err) {
            console.error('Admin fetch orders error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setToken('');
            }
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, status) => {
        try {
            setUpdating(orderId);
            const token = localStorage.getItem('token');
            const res = await axios.post(`${backendURL}/api/order/status`, { orderId, status }, {
                headers: { token }
            });
            if (res.data.success) {
                toast.success('Status updated');
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
            } else {
                toast.error(res.data.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Status update error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setToken('');
            }
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const toggleExpand = (orderId) => {
        setExpanded(expanded === orderId ? null : orderId);
    };

    const formatDate = (d) => {
        const date = new Date(d);
        return date.toLocaleString('en-IN');
    };

    if (loading) {
        return (
            <div className='p-4'>
                <div className='text-gray-600'>Loading orders...</div>
            </div>
        );
    }

    return (
        <div className='p-4'>
            <h2 className='text-xl text-gray-800 font-bold mb-6'>Orders</h2>

            {orders.length === 0 ? (
                <div className='text-gray-600'>No orders yet</div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-100 border-b border-gray-300 text-gray-800 font-semibold'>
                                <th className='text-left p-3'>Order</th>
                                <th className='text-left p-3'>User</th>
                                <th className='text-left p-3'>Items</th>
                                <th className='text-left p-3'>Amount</th>
                                <th className='text-left p-3'>Payment</th>
                                <th className='text-left p-3'>Status</th>
                                <th className='text-left p-3'>Date</th>
                                <th className='text-left p-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const totalItems = (order.items || []).reduce((s, it) => s + (it.quantity || 0), 0);
                                return (
                                    <React.Fragment key={order._id}>
                                        <tr className='border-b border-gray-200 hover:bg-gray-50'>
                                            <td className='p-3 font-mono'>#{order._id.slice(-8)}</td>
                                            <td className='p-3'>{order.userID}</td>
                                            <td className='p-3'>{totalItems}</td>
                                            <td className='p-3'>₹{order.amount}</td>
                                            <td className='p-3'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {order.payment ? (order.paymentMethod || 'PHONEPE') : 'UNPAID'}
                                                </span>
                                            </td>
                                            <td className='p-3'>
                                                <select
                                                    className='border border-gray-300 rounded px-2 py-1 text-sm'
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    disabled={updating === order._id}
                                                >
                                                    {['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='p-3 text-sm text-gray-600'>{formatDate(order.date)}</td>
                                            <td className='p-3'>
                                                <button
                                                    onClick={() => toggleExpand(order._id)}
                                                    className='text-gray-700 hover:text-gray-900 text-sm font-semibold'
                                                >
                                                    {expanded === order._id ? 'Hide' : 'View'} Items
                                                </button>
                                            </td>
                                        </tr>

                                        {expanded === order._id && (
                                            <tr className='bg-gray-50'>
                                                <td className='p-3' colSpan={8}>
                                                    <div className='space-y-3'>
                                                        {(order.items || []).map((item, idx) => (
                                                            <div key={idx} className='flex flex-wrap justify-between border border-gray-200 rounded p-2 bg-white'>
                                                                <div className='text-sm'>
                                                                    <div className='font-semibold'>{item.name || item.productId}</div>
                                                                    <div className='text-gray-600'>Color: {item.color} | Qty: {item.quantity}</div>
                                                                </div>
                                                                <div className='text-sm text-gray-800 font-semibold'>
                                                                    {(item.price || 0) * (item.quantity || 0)} ₹
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* New: order & payment & address details */}
                                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                            <div className='bg-white border border-gray-200 rounded p-3'>
                                                                <h4 className='font-semibold text-sm mb-2'>Order</h4>
                                                                <p className='text-sm text-gray-700'>Order No: #{order._id}</p>
                                                                <p className='text-sm text-gray-700'>Placed: {formatDate(order.date)}</p>
                                                                <p className='text-sm text-gray-700'>User ID: {order.userID}</p>
                                                            </div>
                                                            <div className='bg-white border border-gray-200 rounded p-3'>
                                                                <h4 className='font-semibold text-sm mb-2'>Payment</h4>
                                                                <p className='text-sm text-gray-700'>Method: {order.paymentMethod || 'PHONEPE'}</p>
                                                                <p className='text-sm text-gray-700'>Txn ID: {order.phonePeTxnId || '-'}</p>
                                                                <p className='text-sm text-gray-700'>Status: {order.payment ? 'Paid' : 'Unpaid'}</p>
                                                            </div>
                                                            <div className='bg-white border border-gray-200 rounded p-3'>
                                                                <h4 className='font-semibold text-sm mb-2'>Customer</h4>
                                                                <p className='text-sm text-gray-700'>
                                                                    {(order.address?.firstName || '') + ' ' + (order.address?.lastName || '')}
                                                                </p>
                                                                {order.address?.email && <p className='text-sm text-gray-700'>{order.address.email}</p>}
                                                                {order.address?.phone && <p className='text-sm text-gray-700'>+91 {order.address.phone}</p>}
                                                            </div>
                                                        </div>

                                                        <div className='bg-white border border-gray-200 rounded p-3'>
                                                            <h4 className='font-semibold text-sm mb-2'>Shipping Address</h4>
                                                            <p className='text-sm text-gray-700'>{order.address?.street || ''}</p>
                                                            <p className='text-sm text-gray-700'>
                                                                {(order.address?.city || '')}{order.address?.city ? ', ' : ''}{order.address?.state || ''} {order.address?.pinCode || ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
