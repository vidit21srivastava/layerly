import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StlViewer } from 'react-stl-viewer';
import { ShopContext } from '../context/ShopContext';

const Custom = () => {
    const { backendURL, user, token } = useContext(ShopContext);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    // requester
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // print params (default values match UI)
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

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) {
            setFile(null);
            setPreviewUrl('');
            return;
        }
        if (!f.name.toLowerCase().endsWith('.stl')) {
            toast.error('Please upload an .stl file');
            return;
        }
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please upload an STL file');
            return;
        }
        if (!name || !email) {
            toast.error('Name and Email are required');
            return;
        }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('model', file);
            fd.append('name', name);
            fd.append('email', email);
            if (phone) fd.append('phone', phone);
            fd.append('material', material);
            fd.append('layerHeight', layerHeight);
            fd.append('infill', String(infill));
            fd.append('infillPattern', infillPattern);
            fd.append('supports', String(supports));
            fd.append('brim', String(brim));
            fd.append('raft', String(raft));
            fd.append('color', selectedColor);
            fd.append('instructions', instructions || '');

            const headers = token ? { token } : {};
            const res = await axios.post(`${backendURL}/api/custom/quote`, fd, { headers });
            if (res.data.success) {
                toast.success('Quote submitted! We will email you with remarks soon.');
                // reset minimal
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

    const viewerStyle = useMemo(
        () => ({ width: '100%', height: '360px', backgroundColor: '#f8fafc', borderRadius: '8px' }),
        []
    );

    const getColorStyle = (color) => {
        const map = { red: '#ef4444', orange: '#f97316', gray: '#6b7280', white: '#ffffff', black: '#000000' };
        return map[color] || '#ef4444';
    };

    return (
        <div className='border-t border-gray-300'>
            <main className='pt-8 sm:pt-14 pb-12 sm:pb-16'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h1 className='delius-unicase-regular text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-700 mb-4 text-center'>
                        PRINT CUSTOM
                    </h1>
                    <div className='flex justify-center mb-8'>
                        <hr className='w-16 border-none h-[2px] bg-gray-500' />
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Form */}
                        <div className='lg:col-span-2'>
                            <form onSubmit={handleSubmit} className='space-y-8'>
                                {/* Upload */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        Upload 3D Model
                                    </h2>
                                    <input
                                        type='file'
                                        ref={fileInputRef}
                                        accept='.stl'
                                        onChange={handleFileChange}
                                        className='hidden'
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors duration-200'
                                    >
                                        <p className='text-gray-600 font-medium'>Choose STL File</p>
                                        <p className='text-sm text-gray-500'>Drag and drop or click to browse</p>
                                    </div>
                                    <p className='text-sm text-gray-600 mt-2'>{file ? file.name : 'No file selected'}</p>
                                </div>

                                {/* Requester info */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Your Details</h2>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <input
                                            type='text'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder='Full Name'
                                            required
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'
                                        />
                                        <input
                                            type='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='Email Address'
                                            required
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'
                                        />
                                        <input
                                            type='tel'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder='Phone (optional)'
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none sm:col-span-2'
                                        />
                                    </div>
                                </div>

                                {/* Print settings */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        Print Settings
                                    </h2>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Material</label>
                                            <select
                                                value={material}
                                                onChange={(e) => setMaterial(e.target.value)}
                                                required
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'
                                            >
                                                <option value='PLA'>PLA</option>
                                                <option value='PETG'>PETG</option>
                                                <option value='ABS'>ABS</option>
                                                <option value='TPU'>TPU</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Layer Height</label>
                                            <select
                                                value={layerHeight}
                                                onChange={(e) => setLayerHeight(e.target.value)}
                                                required
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'
                                            >
                                                <option value='0.12'>0.12mm (Super Quality)</option>
                                                <option value='0.16'>0.16mm (Dynamic Quality)</option>
                                                <option value='0.20'>0.20mm (Standard Quality)</option>
                                                <option value='0.28'>0.28mm (Low Quality)</option>
                                            </select>
                                        </div>

                                        <div className='sm:col-span-2'>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Infill Density</label>
                                            <div className='flex items-center gap-4'>
                                                <input
                                                    type='range'
                                                    min='0'
                                                    max='100'
                                                    value={infill}
                                                    onChange={(e) => setInfill(Number(e.target.value))}
                                                    className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                                                />
                                                <span className='text-sm font-medium text-gray-700 min-w-[3rem]'>{infill}%</span>
                                            </div>
                                        </div>

                                        <div className='sm:col-span-2'>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>Infill Pattern</label>
                                            <select
                                                value={infillPattern}
                                                onChange={(e) => setInfillPattern(e.target.value)}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'
                                            >
                                                {[
                                                    'grid', 'lines', 'triangles', 'tri-hexagon', 'cubic', 'cubic-subdivision',
                                                    'octet', 'quarter-cubic', 'concentric', 'zig-zag', 'cross', 'cross-3d',
                                                    'gyroid', 'lightning'
                                                ].map(x => <option key={x} value={x}>{x}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Add-ons */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>Additional Options</h2>
                                    <div className='space-y-3'>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={supports} onChange={(e) => setSupports(e.target.checked)} />
                                            <span className='text-sm text-gray-700'>Generate Support Structures</span>
                                        </label>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={brim} onChange={(e) => setBrim(e.target.checked)} />
                                            <span className='text-sm text-gray-700'>Add Brim</span>
                                        </label>
                                        <label className='flex items-center gap-2'>
                                            <input type='checkbox' checked={raft} onChange={(e) => setRaft(e.target.checked)} />
                                            <span className='text-sm text-gray-700'>Add Raft</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Color */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>Choose Color</label>
                                    <div className='flex gap-3'>
                                        {['red', 'orange', 'gray', 'white', 'black'].map(c => (
                                            <button
                                                type='button'
                                                key={c}
                                                onClick={() => setSelectedColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'}`}
                                                style={{ backgroundColor: getColorStyle(c) }}
                                                title={c}
                                            />
                                        ))}
                                    </div>
                                    <p className='text-sm text-gray-600 mt-2'>Selected: {selectedColor}</p>
                                </div>

                                {/* Instructions */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Special Instructions</h2>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder='Any special requirements or instructions for your print...'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:border-orange-400 focus:outline-none'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className={`w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-400 transition-colors duration-200 ${submitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? 'Submitting...' : 'Get Quote & Proceed'}
                                </button>
                            </form>
                        </div>

                        {/* Preview */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-4'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>3D Model Preview</h3>
                                <div className='aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden'>
                                    {previewUrl ? (
                                        <StlViewer
                                            url={previewUrl}
                                            style={viewerStyle}
                                            shadows
                                            showAxes
                                            ground
                                            modelProps={{ color: getColorStyle(selectedColor) }}
                                        />
                                    ) : (
                                        <div className='w-full h-[360px] flex items-center justify-center text-gray-500'>
                                            <div className='text-center'>
                                                <div className='text-3xl mb-2'>⬆️</div>
                                                <p className='text-sm'>Upload STL file to preview</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='mt-4 text-sm text-gray-600'>
                                    <p className='mb-2'><strong>Supported formats:</strong> STL</p>
                                    <p><strong>Max file size:</strong> 100MB</p>
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
