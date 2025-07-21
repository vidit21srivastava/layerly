import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const NewLaunch = () => {
    console.log('NewLaunch component rendered');
    const { products } = useContext(ShopContext);
    console.log(products);
    return (
        <div></div>
    )
}

export default NewLaunch