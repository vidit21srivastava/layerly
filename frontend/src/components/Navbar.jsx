import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <img src={assets.logo} className='w-12' alt="" />

            <ul className='hidden sm:flex gap-5 text-sm text-grey-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/catalogue' className='flex flex-col items-center gap-1'>
                    <p>Catalogue</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/custom' className='flex flex-col items-center gap-1'>
                    <p>Custom</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>About</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                <div className='group relative'>
                    <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p className='cursor-pointer hover:text-black text-sm'>My Profile</p>
                            <p className='cursor-pointer hover:text-black text-sm'>Orders</p>
                            <p className='cursor-pointer hover:text-black text-sm'>Logout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
