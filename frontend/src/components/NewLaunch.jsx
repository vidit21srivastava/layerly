import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItems from './ProductItems';


const NewLaunch = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products) {
            const sortedProducts = products
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 6)
            setLatestProducts(sortedProducts)
        }
    }, [products])

    return (
        <div className='my-10'>
            <div className='delius-unicase-regular text-left py-2 text-xl mb-4'>
                <h1 className='text-md sm:text-l lg:text-xl font-normal text-gray-900'>
                    NEWLY LAUNCHED
                </h1>
                <hr className='w-16 border-none h-[2px] sm:h-[2.5px] bg-gray-700 ml-32' />

            </div>
            {/* Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-6'>
                {latestProducts.map((item, index) => (
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

export default NewLaunch