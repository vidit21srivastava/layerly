import React, { useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Login = () => {

    const [currentState, setCurrentState] = useState('Sign Up');
    const { token, setToken, navigate, backendURL } = useContext(ShopContext)


    return (
        <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
            <div className=' inline-flex items-center gap2 mb-2 mt-10'>
                <p className='nunito text-3xl md:text-4xl text-gray-700'>{currentState}</p>
            </div>
            <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />
            <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        </form>
    )
}

export default Login
