// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from './Title';

// const NewLaunch = () => {

//     const { products } = useContext(ShopContext);

//     return (
//         <div className='my-10'>
//             <div className='text-left py-8 text-3x1'>
//                 <Title text1={'NEWLY '} text2={'LAUNCHED'} />
//                 <p className='text-gray-600 text-sm mb-8'>Discover our Latest 3D Printed Models</p>
//             </div>
//         </div>


//     )
// }

// export default NewLaunch

import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItems from './ProductItems'

const NewLaunch = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        if (products) {
            // Sort products by date (newest first) and get top 10
            const sortedProducts = products
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
            setLatestProducts(sortedProducts)
        }
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-left py-8 text-l'>
                <Title text1={'NEWLY '} text2={'LAUNCHED'} />
                <p className='text-xs sm:text-sm md:text-base text-gray-600 mb-8'>
                    Discover our Latest 3D Printed Models
                </p>
            </div>

            {/* Displaying Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
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
