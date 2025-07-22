import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
const Navbar = () => {

    const [visible, setVisible] = useState(false);

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'><img src={assets.logo_slogan} className='w-28' alt="" /></Link>


            <ul className='hidden sm:flex gap-5 text-sm text-grey-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/catalogue' className='flex flex-col items-center gap-1'>
                    <p>Catalogue</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/custom' className='flex flex-col items-center gap-1'>
                    <p>Custom</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>About</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                <div className='group relative'>
                    <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white/30 backdrop-blur-sm text-gray-700 rounded'>
                            <p className='cursor-pointer hover:text-orange-400 text-sm'>My Profile</p>
                            <p className='cursor-pointer hover:text-orange-400 text-sm'>Orders</p>
                            <p className='cursor-pointer hover:text-orange-400 text-sm'>Logout</p>
                        </div>
                    </div>
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[12px]'>10</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            {/* Side Menu for Mobile */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden  bg-white/30 backdrop-blur-sm transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center' to='/'>Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center' to='/catalogue'>Catalogue</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center' to='/custom'>Custom</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center' to='/about'>About</NavLink>

                </div>


            </div>



        </div>
    )
}

export default Navbar
