import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const NewLaunch = () => {

    const { products } = useContext(ShopContext);

    return (
        <div className='my-10'>
            <div className='text-left py-8 text-3x1'>
                <Title text1={'NEWLY '} text2={'LAUNCHED'} />
                <p className='text-gray-600 text-sm mb-8'>Discover our Latest 3D Printed Models</p>
            </div>
        </div>


    )
}

export default NewLaunch