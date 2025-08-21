import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'


const ProductItems = ({ id, name, price, product }) => {
    const { currency } = useContext(ShopContext)
    const [selectedColor, setSelectedColor] = useState(product?.availableColors[0] || 'White')

    const currentImage = product?.imagesByColor[selectedColor]

    return (
        <Link
            className='text-gray-700 cursor-pointer group block w-full'
            to={`/product/${id}`}
        >
            <div className='overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col'>
                {/* Product Image */}
                <div className='aspect-square bg-gray-50 relative overflow-hidden'>
                    <img
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        src={currentImage}
                        alt={name}
                        loading="lazy"
                    />

                    {/* Bestseller Badge */}
                    {product?.bestseller && (
                        <div className='absolute top-2 left-2 bg-orange-400 text-white px-2 py-1 text-xs sm:text-xs font-semibold rounded-2xl shadow-sm'>
                            BESTSELLER
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className='p-3 sm:p-4 flex-1 flex flex-col'>
                    {/* Product Name with proper ellipsis */}
                    <h3 className='text-sm sm:text-base font-medium mb-2 flex-shrink-0'>
                        <span
                            className='block overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-normal sm:line-clamp-2'
                            title={name}
                        >
                            {name}
                        </span>
                    </h3>


                    {/* <div className='mb-3 flex-shrink-0'>

                    </div> */}

                    {/* Color, Price and Category Container */}
                    <div className='mt-auto'>
                        {/* Color Selection */}
                        <p className='text-xs text-gray-500 mb-2'>Color:</p>
                        <div className='flex gap-1.5 sm:gap-2 flex-wrap'>
                            {product?.availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setSelectedColor(color)
                                    }}
                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all touch-manipulation ${selectedColor === color
                                        ? 'border-gray-800 scale-110'
                                        : 'border-gray-300 hover:border-gray-500'
                                        }`}
                                    style={{
                                        backgroundColor: getColorHex(color)
                                    }}
                                    title={color}
                                    aria-label={`Select ${color} color`}
                                />
                            ))}
                        </div>
                        <p
                            className='text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis whitespace-nowrap'
                            title={selectedColor}
                        >
                            {selectedColor}
                        </p>
                        {/* Price */}
                        <p className='text-base sm:text-lg font-semibold text-gray-900 mb-1'>
                            <span className='overflow-hidden text-ellipsis whitespace-nowrap block'>
                                {currency}{price}
                            </span>
                        </p>

                        {/* Category */}
                        <p
                            className='text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap'
                            title={product?.category}
                        >
                            {product?.category}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
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

export default ProductItems
