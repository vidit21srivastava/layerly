import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import ProductItems from '../components/ProductItems';

const Bestseller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (products) {
            const bestProducts = products.filter((item) => (item.bestseller));
            setBestSeller(bestProducts.slice(0, 6))
        }
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-left py-2 text-xl mb-4'>
                <h1 className='delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700'>
                    BESTSELLERS
                </h1>
                <hr className='w-16 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-19' />
            </div>
            {/* Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-6'>
                {bestSeller.map((item, index) => (
                    <ProductItems
                        key={index}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        product={item}
                    />
                ))}

            </div>
        </div>
    )
}

export default Bestseller