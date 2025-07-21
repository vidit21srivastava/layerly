import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const NewLaunch = () => {
    console.log('NewLaunch component rendered');
    const { products } = useContext(ShopContext);

    return (
        <div className='my-10'>
            <div className='text-left py-8 text-3x1'>
                <Title text1={'Newly '} text2={'Launched'} />
            </div>
        </div>
    )
}

export default NewLaunch