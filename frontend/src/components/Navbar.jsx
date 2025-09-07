import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { getCartCount, navigate, user, logout, token } = useContext(ShopContext)

    const handleLogout = () => {
        logout()
        setVisible(false)
    }

    const handleProfileClick = () => {
        if (token) {
            navigate('/profile')
        } else {
            navigate('/login')
        }
        setVisible(false)
    }

    const handleOrdersClick = () => {
        if (token) {
            navigate('/orders')
        } else {
            navigate('/login')
        }
        setVisible(false)
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'><img src={assets.logo_slogan} className='w-32' alt="Layerly Logo" /></Link>

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
                {/* Profile Dropdown */}
                <div className='group relative'>
                    <div className='flex items-center cursor-pointer'>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                className='w-8 h-8 rounded-full object-cover border border-gray-300'
                                alt="Profile"
                            />
                        ) : (
                            <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile" />
                        )}
                        {user && (
                            <span className='ml-2 text-sm text-gray-700 hidden sm:block'>
                                Hi, {user.name?.split(' ')[0]} !
                            </span>
                        )}
                    </div>

                    <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='relative z-10 flex flex-col text-center gap-2 w-36 py-3 px-5 bg-gray-400/10 backdrop-blur-sm text-gray-900 rounded'>
                            {token ? (
                                <>
                                    <p
                                        onClick={handleProfileClick}
                                        className='cursor-pointer hover:text-orange-400 text-sm py-1 border-b border-gray-100'
                                    >
                                        My Profile
                                    </p>
                                    <p
                                        onClick={handleOrdersClick}
                                        className='cursor-pointer hover:text-orange-400 text-sm py-1 border-b border-gray-100'
                                    >
                                        My Orders
                                    </p>
                                    <p
                                        onClick={handleLogout}
                                        className='cursor-pointer hover:text-red-500 text-sm py-1 text-red-600 font-medium'
                                    >
                                        Logout
                                    </p>
                                </>
                            ) : (
                                <p
                                    onClick={handleProfileClick}
                                    className='cursor-pointer hover:text-orange-400 text-sm py-1'
                                >
                                    Login / Sign Up
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cart */}
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
                    {getCartCount() > 0 && (
                        <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full font-bold text-[10px]'>
                            {getCartCount()}
                        </p>
                    )}
                </Link>

                {/* Mobile Menu Toggle */}
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className='w-5 cursor-pointer sm:hidden'
                    alt="Menu"
                />
            </div>

            {/* Mobile Side Menu */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div
                        onClick={() => setVisible(false)}
                        className='flex items-center gap-4 p-3 cursor-pointer border-b border-gray-200'
                    >
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back" />
                        <span className='text-sm'>Close Menu</span>
                    </div>

                    {/* User Info Section for Mobile */}
                    {user && (
                        <div className='p-4 border-b border-gray-200 bg-gray-50'>
                            <div className='flex items-center gap-3'>
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className='w-10 h-10 rounded-full object-cover'
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center'>
                                        <span className='font-semibold text-gray-600'>
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className='font-medium text-gray-900'>{user.name}</p>
                                    <p className='text-sm text-gray-600'>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-4 pl-6 border-b border-gray-100 delius-unicase-regular text-gray-700 hover:bg-gray-50'
                        to='/'
                    >
                        HOME
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-4 pl-6 border-b border-gray-100 delius-unicase-regular text-gray-700 hover:bg-gray-50'
                        to='/catalogue'
                    >
                        CATALOGUE
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-4 pl-6 border-b border-gray-100 delius-unicase-regular text-gray-700 hover:bg-gray-50'
                        to='/custom'
                    >
                        CUSTOM
                    </NavLink>
                    <NavLink
                        onClick={() => setVisible(false)}
                        className='py-4 pl-6 border-b border-gray-100 delius-unicase-regular text-gray-700 hover:bg-gray-50'
                        to='/about'
                    >
                        ABOUT
                    </NavLink>

                    {/* Account Actions for Mobile */}
                    <div className='mt-4 border-t border-gray-200'>
                        {token ? (
                            <>
                                <p
                                    onClick={handleProfileClick}
                                    className='py-4 pl-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50 cursor-pointer'
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={handleOrdersClick}
                                    className='py-4 pl-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50 cursor-pointer'
                                >
                                    My Orders
                                </p>
                                <p
                                    onClick={handleLogout}
                                    className='py-4 pl-6 text-red-600 hover:bg-red-50 cursor-pointer font-medium'
                                >
                                    Logout
                                </p>
                            </>
                        ) : (
                            <p
                                onClick={handleProfileClick}
                                className='py-4 pl-6 text-gray-700 hover:bg-gray-50 cursor-pointer'
                            >
                                Login / Sign Up
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
