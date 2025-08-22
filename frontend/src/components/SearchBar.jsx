import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation, useSearchParams } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch } = useContext(ShopContext);


    return (
        <div className='bg-white text-center'>
            <div className='inline-flex items-center justify border bg-gray-100 border-gray-100 px-5 py-2 my-2 mx-3 rounded-full w-3/4 sm:w-1/2'>

                <input value={search} onChange={(e) => setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-base text-gray-600' type='text' placeholder='Search' />
                <img className='w-4 mr-1 mb-0.5' src={assets.search_icon_30} />
            </div>
            <img onClick={() => setSearch('')} className='w-5 inline cursor-pointer' src={assets.cross_icon_24} />
        </div>
    )
}

export default SearchBar