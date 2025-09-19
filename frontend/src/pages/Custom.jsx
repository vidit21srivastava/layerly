import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import StlCanvas from '../components/StlCanvas';

const Custom = () => {
    const { backendURL, user, token } = useContext(ShopContext);


    const [driveLink, setDriveLink] = useState('');
    const [viewerUrl, setViewerUrl] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');


    const [material, setMaterial] = useState('PLA');
    const [layerHeight, setLayerHeight] = useState('0.20');
    const [infill, setInfill] = useState(20);
    const [infillPattern, setInfillPattern] = useState('grid');
    const [supports, setSupports] = useState(false);
    const [brim, setBrim] = useState(false);
    const [raft, setRaft] = useState(false);
    const [selectedColor, setSelectedColor] = useState('red');
    const [instructions, setInstructions] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setName((prev) => prev || user.name || '');
            setEmail((prev) => prev || user.email || '');
            setPhone((prev) => prev || user.phone || '');
        }
    }, [user]);


    const normalizeForViewer = (url) => {
        if (!url) return '';
        try {
            const u = new URL(url);
            if (u.pathname.endsWith('/view')) u.pathname = u.pathname.replace(/\/view$/i, '');
            u.search = '';
            return u.toString();
        } catch {
            return url.replace(/\/view(\?.*)?$/i, '');
        }
    };

    const viewerProxyUrl = driveLink
        ? `${backendURL}/api/custom/proxy-stl?url=${encodeURIComponent(normalizeForViewer(driveLink))}`
        : '';

    useEffect(() => {
        setViewerUrl(normalizeForViewer(driveLink));
    }, [driveLink]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!driveLink) {
            toast.error('Please enter a public Google Drive link to your STL file');
            return;
        }
        if (!name || !email) {
            toast.error('Name and Email are required');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                name, email, phone,
                material, layerHeight, infill: String(infill), infillPattern,
                supports: String(supports), brim: String(brim), raft: String(raft),
                color: selectedColor,
                instructions: instructions || '',
                fileUrl: driveLink // original link
            };
            const headers = token ? { token } : {};
            const res = await axios.post(`${backendURL}/api/custom/quote`, payload, { headers });
            if (res.data.success) {
                toast.success('Quote submitted! We will email you with remarks soon.');
                setInstructions('');
            } else {
                toast.error(res.data.message || 'Failed to submit quote');
            }
        } catch (err) {
            console.error('Submit custom quote error:', err);
            toast.error(err.response?.data?.message || 'Failed to submit quote');
        } finally {
            setSubmitting(false);
        }
    };


    const p = (infill / 100) * 100;

    const getColorStyle = (color) => {
        const map = { red: '#ef4444', orange: '#f97316', gray: '#6b7280', white: '#ffffff', black: '#000000' };
        return map[color] || '#ef4444';
    };

    return (
        <div>
            <main className='pt-8 pb-12 sm:pb-16'>
                <div className='mx-auto px-4'>
                    <div className='py-10 border rounded-xl sm:py-15 bg-gradient-to-bl from-brand-orange to-pink-600 text-white mb-4'>
                        <div className='max-w-4xl mx-auto px-4 text-center'>
                            <h1 className='text-2xl sm:text-5xl font-semibold'>
                                Order Custom
                            </h1>
                        </div>

                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                        <div className='lg:col-span-2'>
                            <form onSubmit={handleSubmit} className='space-y-8'>

                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        STL File Link - Google Drive
                                    </h2>
                                    <input
                                        type='url'
                                        value={driveLink}
                                        onChange={(e) => setDriveLink(e.target.value)}
                                        placeholder='Paste your Google Drive public link here'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500'
                                        required
                                    />
                                    <p className='text-xs text-gray-600 mt-2'>
                                        Make sure the file is publicly accessible. Ensure “Anyone with the link” can view.
                                    </p>
                                </div>


                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Your Details</h2>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <input
                                            type='text'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder='Full Name*'
                                            required
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500'
                                        />
                                        <input
                                            type='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='Email Address*'
                                            required
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500'
                                        />
                                        <input
                                            type='tel'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder='Phone*'
                                            required
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none sm:col-span-2'
                                        />
                                    </div>
                                </div>


                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        Print Settings
                                    </h2>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-md font-medium text-gray-700 mb-2'>Material</label>
                                            <select
                                                value={material}
                                                onChange={(e) => setMaterial(e.target.value)}
                                                required
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none'
                                            >
                                                <option value='PLA'>PLA</option>
                                                <option value='PETG'>PETG</option>
                                                <option value='ABS'>ABS</option>
                                                <option value='TPU'>TPU</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-md font-medium text-gray-700 mb-2'>Layer Height</label>
                                            <select
                                                value={layerHeight}
                                                onChange={(e) => setLayerHeight(e.target.value)}
                                                required
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none'
                                            >
                                                <option value='0.12'>0.12mm (Super Quality)</option>
                                                <option value='0.16'>0.16mm (Dynamic Quality)</option>
                                                <option value='0.20'>0.20mm (Standard Quality)</option>
                                                <option value='0.28'>0.28mm (Low Quality)</option>
                                            </select>
                                        </div>
                                        <div className='sm:col-span-2'>
                                            <label className='block text-md font-medium text-gray-700 mb-2'>Infill Density</label>
                                            <div className='flex items-center gap-4'>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={infill}
                                                    onChange={(e) => setInfill(Number(e.target.value))}
                                                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                                                    style={{
                                                        background: `linear-gradient(to right, #8AC0FF 0%, #8AC0FF ${p}%, #e5e7eb ${p}%, #e5e7eb 100%)`
                                                    }}
                                                />
                                                <span className='text-sm font-medium text-gray-700 min-w-[3rem]'>{infill}%</span>
                                            </div>
                                        </div>
                                        <div className='sm:col-span-2'>
                                            <label className='block text-md font-medium text-gray-700 mb-2'>Infill Pattern</label>
                                            <select
                                                value={infillPattern}
                                                onChange={(e) => setInfillPattern(e.target.value)}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none'
                                            >
                                                {[
                                                    'Grid', 'Lines', 'Triangles', 'Tri-hexagon', 'Cubic', 'Cubic-subdivision',
                                                    'Octet', 'Quarter-cubic', 'Concentric', 'Zig-zag', 'Cross', 'Cross-3d',
                                                    'Gyroid', 'Lightning'
                                                ].map(x => <option key={x} value={x}>{x}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>Add-ons</h2>
                                    <div className='space-y-3'>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={supports} onChange={(e) => setSupports(e.target.checked)} />
                                            <span className='text-md text-gray-700'>Generate Support Structures</span>
                                        </label>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={brim} onChange={(e) => setBrim(e.target.checked)} />
                                            <span className='text-md text-gray-700'>Add Brim</span>
                                        </label>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={raft} onChange={(e) => setRaft(e.target.checked)} />
                                            <span className='text-md text-gray-700'>Add Raft</span>
                                        </label>
                                    </div>
                                </div>


                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>Choose Color</label>
                                    <div className='flex gap-3'>
                                        {['red', 'orange', 'gray', 'white', 'black'].map(c => (
                                            <button
                                                type='button'
                                                key={c}
                                                onClick={() => setSelectedColor(c)}
                                                className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
                                                    }`}
                                                style={{ backgroundColor: getColorStyle(c) }}
                                                title={c}
                                            />
                                        ))}
                                    </div>
                                    <p className='text-sm text-gray-600 mt-2'>Selected: {selectedColor}</p>
                                </div>


                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Special Instructions</h2>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder='Any special requirements or instructions for your print...'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:border-gray-500 focus:outline-none'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className={`w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-400 transition-colors duration-200 ${submitting ? 'opacity-80 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {submitting ? 'Submitting...' : 'Get Quote & Proceed'}
                                </button>
                            </form>
                        </div>


                        <div className='lg:col-span-1'>
                            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-4'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>3D Model Preview</h3>
                                <div className='aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden'>
                                    {viewerProxyUrl ? (
                                        <StlCanvas
                                            url={viewerProxyUrl}
                                            color={getColorStyle(selectedColor)}
                                            background="#f8fafc"
                                            height={360}
                                        />
                                    ) : (
                                        <div className='w-full h-[360px] flex items-center justify-center text-gray-500'>
                                            <div className='text-center'>
                                                <p className='text-sm'>Paste a public STL file Google Drive link to preview</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='mt-4 text-sm text-gray-600'>
                                    <p className='mb-2'><strong>Tip:</strong> You can Rotate/Zoom-in/Zoom-out the model above for better preview.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Custom;
