// import React from 'react'
// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//     return (
//         <div className='w-15 sm:w-15 md:w-70 min-h-screen border-r border-gray-200 bg-gray-100'>
//             <div className='flex flex-col gap-2 pt-6 pl-[20%] text-sm md:text-base lg:text-lg'>

//                 <NavLink
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
//                             ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
//                             : 'hover:bg-white hover:shadow-sm'
//                         }`
//                     }
//                     to='/add'
//                 >
//                     <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
//                     </svg>
//                     <p className='hidden md:block font-medium lg:font-semibold'>Add Items</p>
//                 </NavLink>

//                 <NavLink
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
//                             ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
//                             : 'hover:bg-white hover:shadow-sm'
//                         }`
//                     }
//                     to='/list'
//                 >
//                     <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
//                     </svg>
//                     <p className='hidden md:block font-medium lg:font-semibold'>List Items</p>
//                 </NavLink>

//                 <NavLink
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
//                             ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
//                             : 'hover:bg-white hover:shadow-sm'
//                         }`
//                     }
//                     to='/orders'
//                 >
//                     <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
//                     </svg>
//                     <p className='hidden md:block font-medium lg:font-semibold'>Orders</p>
//                 </NavLink>

//                 <NavLink
//                     className={({ isActive }) =>
//                         `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm' : 'hover:bg-white hover:shadow-sm'
//                         }`
//                     }
//                     to='/quotes'
//                 >
//                     <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7h18M3 12h18M3 17h12' />
//                     </svg>
//                     <p className='hidden md:block font-medium lg:font-semibold'>Quotes</p>
//                 </NavLink>

//             </div>
//         </div>
//     )
// }

// export default Sidebar

import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='w-15 sm:w-15 md:w-70 min-h-screen border-r border-gray-200 bg-gray-100'>
            <div className='flex flex-col gap-2 pt-6 pl-[20%] text-sm md:text-base lg:text-lg'>
                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
                            ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
                            : 'hover:bg-white hover:shadow-sm'
                        }`
                    }
                    to='/add'
                >
                    <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
                    </svg>
                    <p className='hidden md:block font-medium lg:font-semibold'>Add Items</p>
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
                            ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
                            : 'hover:bg-white hover:shadow-sm'
                        }`
                    }
                    to='/list'
                >
                    <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                    </svg>
                    <p className='hidden md:block font-medium lg:font-semibold'>List Items</p>
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
                            ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
                            : 'hover:bg-white hover:shadow-sm'
                        }`
                    }
                    to='/orders'
                >
                    <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    <p className='hidden md:block font-medium lg:font-semibold'>Orders</p>
                </NavLink>

                {/* ADD: Quotes */}
                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all duration-200 ${isActive
                            ? 'bg-amber-50 border-orange-600 text-orange-600 shadow-sm'
                            : 'hover:bg-white hover:shadow-sm'
                        }`
                    }
                    to='/quotes'
                >
                    <svg className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7h18M3 12h18M3 17h12' />
                    </svg>
                    <p className='hidden md:block font-medium lg:font-semibold'>Quotes</p>
                </NavLink>
            </div>
        </div>
    )
}
export default Sidebar
