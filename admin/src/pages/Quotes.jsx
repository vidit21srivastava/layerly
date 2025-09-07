import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
    const cls = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        REPLIED: 'bg-green-100 text-green-800',
        CLOSED: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-1 text-xs rounded-full font-semibold ${cls}`}>{status}</span>;
};

const Quotes = ({ setToken }) => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [replyState, setReplyState] = useState({}); // { [id]: { remark, price } }
    const [sending, setSending] = useState(null);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${backendURL}/api/custom/quotes`, { headers: { token } });
            if (res.data.success) {
                setQuotes(res.data.quotes || []);
            } else {
                toast.error(res.data.message || 'Failed to fetch quotes');
            }
        } catch (err) {
            console.error('Fetch quotes error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setToken('');
            }
            toast.error('Failed to fetch quotes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleReplyChange = (id, key, value) => {
        setReplyState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }));
    };

    const sendReply = async (id) => {
        const token = localStorage.getItem('token');
        const body = {
            remark: replyState[id]?.remark || '',
            price: replyState[id]?.price ?? null
        };
        if (!body.remark) {
            toast.error('Please enter a remark');
            return;
        }
        try {
            setSending(id);
            const res = await axios.post(`${backendURL}/api/custom/quote/${id}/reply`, body, { headers: { token } });
            if (res.data.success) {
                toast.success('Reply sent to user');
                fetchQuotes();
            } else {
                toast.error(res.data.message || 'Failed to send reply');
            }
        } catch (err) {
            console.error('Send reply error:', err);
            toast.error(err.response?.data?.message || 'Failed to send reply');
        } finally {
            setSending(null);
        }
    };

    const closeQuote = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(`${backendURL}/api/custom/quote/${id}/close`, {}, { headers: { token } });
            if (res.data.success) {
                toast.success('Quote closed');
                fetchQuotes();
            } else {
                toast.error(res.data.message || 'Failed to close quote');
            }
        } catch (err) {
            console.error('Close quote error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setToken('');
            }
            toast.error('Failed to close quote');
        }
    };

    const fmtDate = (d) => new Date(d).toLocaleString('en-IN');

    if (loading) {
        return <div className='p-4 text-gray-600'>Loading quotes...</div>;
    }

    return (
        <div className='p-4'>
            <h2 className='text-xl text-gray-800 font-bold mb-6'>Custom Quotes</h2>
            {quotes.length === 0 ? (
                <div className='text-gray-600'>No custom quote requests yet.</div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-100 border-b border-gray-300 text-gray-800 font-semibold'>
                                <th className='text-left p-3'>Requested</th>
                                <th className='text-left p-3'>Requester</th>
                                <th className='text-left p-3'>Email</th>
                                <th className='text-left p-3'>Material</th>
                                <th className='text-left p-3'>Layer</th>
                                <th className='text-left p-3'>Infill</th>
                                <th className='text-left p-3'>Status</th>
                                <th className='text-left p-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map(q => (
                                <React.Fragment key={q._id}>
                                    <tr className='border-b border-gray-200 hover:bg-gray-50'>
                                        <td className='p-3 text-sm'>{fmtDate(q.createdAt)}</td>
                                        <td className='p-3 text-sm'>{q.name}{q.phone ? ` (${q.phone})` : ''}</td>
                                        <td className='p-3 text-sm'>{q.email}</td>
                                        <td className='p-3 text-sm'>{q.material}</td>
                                        <td className='p-3 text-sm'>{q.layerHeight} mm</td>
                                        <td className='p-3 text-sm'>{q.infill}%</td>
                                        <td className='p-3'><StatusBadge status={q.status} /></td>
                                        <td className='p-3'>
                                            <button
                                                onClick={() => toggleExpand(q._id)}
                                                className='text-gray-700 hover:text-gray-900 text-sm font-semibold'
                                            >
                                                {expanded === q._id ? 'Hide' : 'Expand'}
                                            </button>
                                        </td>
                                    </tr>

                                    {expanded === q._id && (
                                        <tr className='bg-gray-50'>
                                            <td colSpan={8} className='p-4'>
                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                    <div className='bg-white p-3 rounded border'>
                                                        <h4 className='font-semibold text-sm mb-2'>Print Details</h4>
                                                        <p className='text-sm text-gray-700'>Material: {q.material}</p>
                                                        <p className='text-sm text-gray-700'>Layer: {q.layerHeight} mm</p>
                                                        <p className='text-sm text-gray-700'>Infill: {q.infill}% ({q.infillPattern})</p>
                                                        <p className='text-sm text-gray-700'>Color: {q.color}</p>
                                                        <p className='text-sm text-gray-700'>Supports: {q.supports ? 'Yes' : 'No'}</p>
                                                        <p className='text-sm text-gray-700'>Brim: {q.brim ? 'Yes' : 'No'}</p>
                                                        <p className='text-sm text-gray-700'>Raft: {q.raft ? 'Yes' : 'No'}</p>
                                                    </div>

                                                    <div className='bg-white p-3 rounded border'>
                                                        <h4 className='font-semibold text-sm mb-2'>File</h4>
                                                        <a
                                                            href={q.fileUrl}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            className='text-blue-600 hover:underline text-sm'
                                                        >
                                                            Download STL
                                                        </a>
                                                        <p className='text-xs text-gray-500 mt-2 break-all'>{q.fileUrl}</p>
                                                        {q.instructions && (
                                                            <>
                                                                <h4 className='font-semibold text-sm mt-4 mb-2'>Instructions</h4>
                                                                <p className='text-sm text-gray-700 whitespace-pre-wrap'>{q.instructions}</p>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className='bg-white p-3 rounded border'>
                                                        <h4 className='font-semibold text-sm mb-2'>Reply to User</h4>
                                                        <textarea
                                                            rows={4}
                                                            placeholder='Write your remark...'
                                                            className='w-full border border-gray-300 rounded p-2 text-sm'
                                                            value={replyState[q._id]?.remark || ''}
                                                            onChange={(e) => handleReplyChange(q._id, 'remark', e.target.value)}
                                                        />
                                                        <div className='mt-2 flex items-center gap-2'>
                                                            <span className='text-sm'>Estimated Price (₹):</span>
                                                            <input
                                                                type='number'
                                                                min='0'
                                                                className='w-28 border border-gray-300 rounded p-1 text-sm'
                                                                value={replyState[q._id]?.price ?? ''}
                                                                onChange={(e) => handleReplyChange(q._id, 'price', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='mt-3 flex gap-2'>
                                                            <button
                                                                onClick={() => sendReply(q._id)}
                                                                disabled={sending === q._id}
                                                                className='bg-gray-900 text-white px-3 py-1 rounded text-sm font-bold hover:bg-gray-700'
                                                            >
                                                                {sending === q._id ? 'Sending...' : 'Send Reply'}
                                                            </button>
                                                            <button
                                                                onClick={() => closeQuote(q._id)}
                                                                className='border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-bold hover:bg-gray-50'
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                        {q.adminRemark && (
                                                            <p className='text-xs text-gray-500 mt-2'>
                                                                Last remark: {q.adminRemark} {q.price ? `| ₹ ${q.price}` : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Quotes;
