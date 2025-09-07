import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';
import StlCanvas from '../components/StlCanvas';

const StatusBadge = ({ status }) => {
    const cls =
        {
            PENDING: 'bg-yellow-100 text-yellow-800',
            REPLIED: 'bg-green-100 text-green-800',
            CLOSED: 'bg-gray-100 text-gray-800',
        }[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${cls}`}>
            {status}
        </span>
    );
};

const normalizeForViewer = (url) => {
    if (!url) return '';
    try {
        const u = new URL(url);
        if (u.pathname.endsWith('/view')) {
            u.pathname = u.pathname.replace(/\/view$/i, '');
        }
        u.search = '';
        return u.toString();
    } catch {
        return url.replace(/\/view(\?.*)?$/i, '');
    }
};

const buildProxyUrl = (fileUrl) => {
    if (!fileUrl) return '';
    const trimmed = normalizeForViewer(fileUrl);
    return `${backendURL}/api/custom/proxy-stl?url=${encodeURIComponent(trimmed)}`;
};

const buildDriveDirectDownload = (fileUrl) => {
    if (!fileUrl) return '';
    try {
        const u = new URL(fileUrl);

        if (u.hostname === 'drive.google.com' && u.pathname.startsWith('/uc')) {
            return u.toString();
        }

        if (u.hostname === 'drive.google.com') {
            const m = u.pathname.match(/\/file\/d\/([^/]+)/i);
            if (m && m[1]) {
                return `https://drive.google.com/uc?export=download&id=${m[1]}`;
            }
        }
        return fileUrl;
    } catch {
        return fileUrl;
    }
};

const colorToHex = (c) => {
    const map = {
        red: '#ef4444',
        orange: '#f97316',
        gray: '#6b7280',
        white: '#ffffff',
        black: '#000000',
    };
    return map[c?.toLowerCase?.()] || '#ef4444';
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

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const handleReplyChange = (id, key, value) => {
        setReplyState((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }));
    };

    const sendReply = async (id) => {
        const token = localStorage.getItem('token');
        const rawRemark = replyState[id]?.remark || '';
        const rawPrice = replyState[id]?.price;

        const body = {
            remark: rawRemark,
            price:
                rawPrice === '' || rawPrice === undefined || rawPrice === null
                    ? null
                    : Number(rawPrice),
        };

        if (!body.remark) {
            toast.error('Please enter a remark');
            return;
        }

        try {
            setSending(id);
            const res = await axios.post(
                `${backendURL}/api/custom/quote/${id}/reply`,
                body,
                { headers: { token } }
            );
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
        if (!window.confirm('Are you sure you want to close this quote (This can not be undone)?')) {
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(
                `${backendURL}/api/custom/quote/${id}/close`,
                {},
                { headers: { token } }
            );
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

    if (loading) return <div className="p-4 text-gray-600">Loading quotes...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl text-gray-800 font-bold mb-6">Custom Quotes</h2>

            {quotes.length === 0 ? (
                <div className="text-gray-600">No custom quote requests yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 font-semibold">
                                <th className="text-left p-3">Requested</th>
                                <th className="text-left p-3">Requester</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Material</th>
                                <th className="text-left p-3">Layer</th>
                                <th className="text-left p-3">Infill</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {quotes.map((q) => (
                                <React.Fragment key={q._id}>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 text-sm">{fmtDate(q.createdAt)}</td>
                                        <td className="p-3 text-sm">
                                            {q.name}
                                            {q.phone ? ` (${q.phone})` : ''}
                                        </td>
                                        <td className="p-3 text-sm">{q.email}</td>
                                        <td className="p-3 text-sm">{q.material}</td>
                                        <td className="p-3 text-sm">{q.layerHeight} mm</td>
                                        <td className="p-3 text-sm">{q.infill}%</td>
                                        <td className="p-3">
                                            <StatusBadge status={q.status} />
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => toggleExpand(q._id)}
                                                className="text-gray-700 hover:text-gray-900 text-sm font-semibold"
                                            >
                                                {expanded === q._id ? 'Hide' : 'Expand'}
                                            </button>
                                        </td>
                                    </tr>

                                    {expanded === q._id && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={8} className="p-4">
                                                <div className="flex flex-col lg:flex-row gap-6">

                                                    <div className='flex flex-col gap-4 lg:flex-1 lg:max-w-md'>
                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                            <h4 className="font-bold text-md mb-3">Print Details</h4>
                                                            <div className="space-y-1 grid grid-cols-2 grid-rows-3">
                                                                <p className="text-sm font-bold text-gray-700">Material: {q.material}</p>
                                                                <p className="text-sm font-bold text-gray-700">Layer: {q.layerHeight} mm</p>
                                                                <p className="text-sm font-bold text-gray-700">
                                                                    Infill: {q.infill}% ({q.infillPattern})
                                                                </p>
                                                                <p className="text-sm font-bold text-gray-700">Color: {q.color}</p>
                                                                <p className="text-sm font-bold text-gray-700">
                                                                    Supports: {q.supports ? 'Yes' : 'No'}
                                                                </p>
                                                                <p className="text-sm font-bold text-gray-700">Brim: {q.brim ? 'Yes' : 'No'}</p>
                                                                <p className="text-sm font-bold text-gray-700">Raft: {q.raft ? 'Yes' : 'No'}</p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                            <h4 className="font-bold text-md mb-3">Reply to User</h4>
                                                            <textarea
                                                                rows={4}
                                                                placeholder="Write your remark..."
                                                                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                                                value={replyState[q._id]?.remark || ''}
                                                                onChange={(e) =>
                                                                    handleReplyChange(q._id, 'remark', e.target.value)
                                                                }
                                                            />
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <span className="text-sm font-medium">Estimated Price:</span>
                                                                <span>₹</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    className="w-32 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                                                    value={replyState[q._id]?.price ?? ''}
                                                                    onChange={(e) =>
                                                                        handleReplyChange(q._id, 'price', e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mt-4 flex gap-3">
                                                                <button
                                                                    onClick={() => sendReply(q._id)}
                                                                    disabled={sending === q._id}
                                                                    className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    {sending === q._id ? 'Sending...' : 'Send Reply'}
                                                                </button>
                                                                <button
                                                                    onClick={() => closeQuote(q._id)}
                                                                    className="text-red-500 px-3 py-1 rounded font-bold border border-gray-50 hover:border-red-500"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                            {(q.adminRemark || q.price != null) && (
                                                                <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                                                    <p className="text-xs text-gray-600">
                                                                        <span className="font-medium">Last remark:</span> {q.adminRemark}
                                                                        {q.price ? ` | ₹${q.price}` : ''}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>


                                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm lg:flex-1">
                                                        <h4 className="font-bold text-md mb-3">Preview</h4>
                                                        <div className="w-full mb-4 rounded-lg border border-gray-50 ">
                                                            <StlCanvas
                                                                url={buildProxyUrl(q.fileUrl)}
                                                                color={colorToHex(q.color)}
                                                                background="#f8fafc"
                                                                height={380}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <a
                                                                href={buildDriveDirectDownload(q.fileUrl)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors text-center"
                                                            >
                                                                Download STL
                                                            </a>
                                                        </div>
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
