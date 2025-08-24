import React, { useState, useRef } from 'react'

const Custom = () => {
    const [fileName, setFileName] = useState('No file selected');
    const [infill, setInfill] = useState(20);
    const [selectedColor, setSelectedColor] = useState('red');
    const [showContactModal, setShowContactModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFileName(files[0].name);
        } else {
            setFileName('No file selected');
        }
    };

    const handleInfillChange = (e) => {
        setInfill(e.target.value);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccessModal(true);
    };

    const getColorStyle = (color) => {
        const colorMap = {
            'red': '#ef4444',
            'orange': '#f97316',
            'gray': '#6b7280',
            'white': '#ffffff',
            'black': '#000000'
        };
        return colorMap[color] || '#ef4444';
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
                        {/* Form Section */}
                        <div className='lg:col-span-2'>
                            <form onSubmit={handleSubmit} className='space-y-8'>
                                {/* File Upload */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        <i className="fas fa-file-upload text-orange-400"></i>
                                        Upload 3D Model
                                    </h2>
                                    <div className='space-y-4'>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept=".stl"
                                            required
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors duration-200'
                                        >
                                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                            <p className='text-gray-600 font-medium'>Choose STL File</p>
                                            <p className='text-sm text-gray-500'>Drag and drop or click to browse</p>
                                        </div>
                                        <p className='text-sm text-gray-600'>{fileName}</p>
                                    </div>
                                </div>

                                {/* Print Settings */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        <i className="fas fa-cogs text-orange-400"></i>
                                        Print Settings
                                    </h2>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {/* Material Selection */}
                                        <div>
                                            <label htmlFor="material" className='block text-sm font-medium text-gray-700 mb-2'>
                                                Material
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="Choose your desired material">ⓘ</span>
                                            </label>
                                            <select id="material" required className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'>
                                                <option value="PLA">PLA</option>
                                                <option value="PETG">PETG</option>
                                                <option value="ABS">ABS</option>
                                                <option value="TPU">TPU</option>
                                            </select>
                                        </div>

                                        {/* Layer Height */}
                                        <div>
                                            <label htmlFor="layerHeight" className='block text-sm font-medium text-gray-700 mb-2'>
                                                Layer Height
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="Higher = Faster, Lower = Detailed">ⓘ</span>
                                            </label>
                                            <select id="layerHeight" required className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'>
                                                <option value="0.12">0.12mm (Super Quality)</option>
                                                <option value="0.16">0.16mm (Dynamic Quality)</option>
                                                <option value="0.20">0.20mm (Standard Quality)</option>
                                                <option value="0.28">0.28mm (Low Quality)</option>
                                            </select>
                                        </div>

                                        {/* Infill Density */}
                                        <div className='sm:col-span-2'>
                                            <label htmlFor="infill" className='block text-sm font-medium text-gray-700 mb-2'>
                                                Infill Density
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="Higher value will give more strength but increased mass">ⓘ</span>
                                            </label>
                                            <div className='flex items-center gap-4'>
                                                <input
                                                    type="range"
                                                    id="infill"
                                                    min="0"
                                                    max="100"
                                                    value={infill}
                                                    onChange={handleInfillChange}
                                                    required
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <span className='text-sm font-medium text-gray-700 min-w-[3rem]'>{infill}%</span>
                                            </div>
                                        </div>

                                        {/* Infill Pattern */}
                                        <div className='sm:col-span-2'>
                                            <label htmlFor="infillPattern" className='block text-sm font-medium text-gray-700 mb-2'>Infill Pattern</label>
                                            <select id="infillPattern" className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-400 focus:outline-none'>
                                                <option value="grid">Grid</option>
                                                <option value="lines">Lines</option>
                                                <option value="triangles">Triangles</option>
                                                <option value="tri-hexagon">Tri-Hexagon</option>
                                                <option value="cubic">Cubic</option>
                                                <option value="cubic-subdivision">Cubic Subdivision</option>
                                                <option value="octet">Octet</option>
                                                <option value="quarter-cubic">Quarter Cubic</option>
                                                <option value="concentric">Concentric</option>
                                                <option value="zig-zag">Zig-Zag</option>
                                                <option value="cross">Cross</option>
                                                <option value="cross-3d">Cross 3D</option>
                                                <option value="gyroid">Gyroid</option>
                                                <option value="lightning">Lightning</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        <i className="fas fa-tools text-orange-400"></i>
                                        Additional Options
                                    </h2>

                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-2'>
                                            <input type="checkbox" id="supports" className='rounded border-gray-300 focus:ring-orange-400' />
                                            <label htmlFor="supports" className='text-sm text-gray-700'>
                                                Generate Support Structures
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="Recommended for overhangs >45°">ⓘ</span>
                                            </label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input type="checkbox" id="brim" className='rounded border-gray-300 focus:ring-orange-400' />
                                            <label htmlFor="brim" className='text-sm text-gray-700'>
                                                Add Brim
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="Improves bed adhesion">ⓘ</span>
                                            </label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input type="checkbox" id="raft" className='rounded border-gray-300 focus:ring-orange-400' />
                                            <label htmlFor="raft" className='text-sm text-gray-700'>
                                                Add Raft
                                                <span className='ml-1 text-xs text-gray-500 cursor-help' title="For better first layer adhesion">ⓘ</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>Choose Color</label>
                                    <div className='flex gap-3'>
                                        {['red', 'orange', 'gray', 'white', 'black'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleColorSelect(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${color === selectedColor ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
                                                    }`}
                                                style={{ backgroundColor: getColorStyle(color) }}
                                                title={color.charAt(0).toUpperCase() + color.slice(1)}
                                            />
                                        ))}
                                    </div>
                                    <p className='text-sm text-gray-600 mt-2'>Selected: {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</p>
                                </div>

                                {/* Special Instructions */}
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4'>
                                        <i className="fas fa-comment-alt text-orange-400"></i>
                                        Special Instructions
                                    </h2>
                                    <textarea
                                        id="instructions"
                                        placeholder="Any special requirements or instructions for your print..."
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:border-orange-400 focus:outline-none'
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className='w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-400 transition-colors duration-200 flex items-center justify-center gap-2'
                                >
                                    <i className="fas fa-calculator"></i>
                                    Get Quote & Proceed
                                </button>
                            </form>
                        </div>

                        {/* Preview Section */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-4'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-4'>3D Model Preview</h3>
                                <div className='aspect-square bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200'>
                                    <div className='text-center text-gray-500'>
                                        <i className="fas fa-cube text-3xl mb-2"></i>
                                        <p className='text-sm'>Upload STL file to preview</p>
                                    </div>
                                </div>
                                <div className='mt-4 text-sm text-gray-600'>
                                    <p className='mb-2'><strong>Supported formats:</strong> STL</p>
                                    <p><strong>Max file size:</strong> 100MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Modal */}
                {showContactModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => setShowContactModal(false)}>
                        <div className='bg-white p-6 rounded-lg max-w-md w-full mx-4' onClick={e => e.stopPropagation()}>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='text-lg font-semibold text-gray-900'>Contact Us</h3>
                                <button onClick={() => setShowContactModal(false)} className='text-gray-500 hover:text-gray-700'>×</button>
                            </div>
                            <div className='space-y-2'>
                                <p><strong>Phone:</strong> +91-9664851323</p>
                                <p><strong>Email:</strong> layerly2024@gmail.com</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => setShowSuccessModal(false)}>
                        <div className='bg-white p-6 rounded-lg max-w-md w-full mx-4' onClick={e => e.stopPropagation()}>
                            <div className='text-center'>
                                <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Request Submitted Successfully!</h3>
                                <p className='text-gray-600 mb-6'>
                                    Thank you for your custom 3D print request. Our team will review your STL file and settings,
                                    and we'll send you a personalized quote within 24 hours.
                                </p>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className='bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-orange-400 transition-colors duration-200'
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>



        </div>
    )
}

export default Custom
