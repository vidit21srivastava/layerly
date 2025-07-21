import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'

const BestSeller = () => {

    const { products } = useState(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    useEffect(() => {
        const bestProduct = products.filter((items) => (items.bestseller))
        setBestSeller(bestProduct.slice(0, 5))
    }, [])

    return (
        <div>BestSeller</div>
    )
}

export default BestSeller