import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const { getCartCount, navigate } = useContext(ShopContext);

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'><img src={assets.logo_slogan} className='w-32' alt="" /></Link>


            <ul className='hidden sm:flex gap-5 text-sm text-grey-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p className='delius-unicase-regular'>HOME</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/catalogue' className='flex flex-col items-center gap-1'>
                    <p className='delius-unicase-regular'>CATALOGUE</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/custom' className='flex flex-col items-center gap-1'>
                    <p className='delius-unicase-regular'>CUSTOM</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p className='delius-unicase-regular'>ABOUT</p>
                    <hr className='w-2/4 border-none h-[2.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                {/* <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" /> */}
                <div className='group relative'>
                    <Link to='/login'><img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" /></Link>
                    <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4'>
                        <div className='relative z-10 flex flex-col text-center gap-2 w-36 py-3 px-5 bg-gray-400/10 backdrop-blur-sm text-gray-900 rounded'>
                            <p className='cursor-pointer hover:text-orange-400 text-sm'>My Profile</p>
                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-orange-400 text-sm'>Orders</p>
                            <p className='cursor-pointer hover:text-orange-400 text-sm'>Logout</p>
                        </div>
                    </div>
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    {getCartCount() > 0 && (
                        <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full font-bold text-[10px]'>
                            {getCartCount()}
                        </p>
                    )}
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            {/* Side Menu for Mobile */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center delius-unicase-regular' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center delius-unicase-regular' to='/catalogue'>CATALOGUE</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center delius-unicase-regular' to='/custom'>CUSTOM</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 p1-6 flex items-center justify-center delius-unicase-regular' to='/about'>ABOUT</NavLink>

                </div>


            </div>



        </div>
    )
}

export default Navbar
