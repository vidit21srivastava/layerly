import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItems = ({ id, name, price, product }) => {
    const { currency } = useContext(ShopContext)
    const [selectedColor, setSelectedColor] = useState(product?.availableColors[0] || 'Black')

    // Get the current image based on selected color
    const currentImage = product?.imagesByColor[selectedColor]

    return (
        <Link
            className='text-gray-700 cursor-pointer group'
            to={`/product/${id}`}
        >
            <div className='overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                {/* Product Image */}
                <div className='aspect-square bg-gray-50 relative'>
                    <img
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        src={currentImage}
                        alt={name}
                    />

                    {/* Bestseller Badge */}
                    {product?.bestseller && (
                        <div className='absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded'>
                            BESTSELLER
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className='p-4'>
                    {/* Product Name */}
                    <p className='text-sm font-medium mb-2 line-clamp-2'>
                        {name}
                    </p>

                    {/* Color Selection */}
                    <div className='mb-3'>
                        <p className='text-xs text-gray-500 mb-2'>Color:</p>
                        <div className='flex gap-2 flex-wrap'>
                            {product?.availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setSelectedColor(color)
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color
                                        ? 'border-gray-800 scale-110'
                                        : 'border-gray-300 hover:border-gray-500'
                                        }`}
                                    style={{
                                        backgroundColor: getColorHex(color)
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                        <p className='text-xs text-gray-600 mt-1'>{selectedColor}</p>
                    </div>

                    {/* Price */}
                    <p className='text-lg font-semibold text-gray-900'>
                        {currency}{price}
                    </p>

                    {/* Category */}
                    <p className='text-xs text-gray-500 mt-1'>
                        {product?.category}
                    </p>
                </div>
            </div>
        </Link>
    )
}

// Helper function to get hex colors for the color swatches
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

export default ProductItems
