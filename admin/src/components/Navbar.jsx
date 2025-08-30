import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <div className='flex items-center gap-2'>
                <img className='w-32 md:w-42' src={assets.logo_slogan} alt="" />
                <p className='text-lg font-bold text-gray-600'>ADMIN PANEL</p>
            </div>
            <button onClick={() => setToken('')} className='bg-gray-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-bold'>Logout</button>
        </div>
    )
}

export default Navbar
