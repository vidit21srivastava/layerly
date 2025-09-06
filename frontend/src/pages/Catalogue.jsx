import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import ProductItems from '../components/ProductItems';
import SearchBar from '../components/SearchBar';

const Catalogue = () => {

    const { products, search } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice();
        if (search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }
        if (sortType === 'low-high') {
            productsCopy.sort((a, b) => a.price - b.price);
        } else if (sortType === 'high-low') {
            productsCopy.sort((a, b) => b.price - a.price);
        }
        setFilterProducts(productsCopy);
    }

    const sortProduct = () => {
        let filterProductCopy = filterProducts.slice();
        switch (sortType) {
            case 'low-high':
                setFilterProducts(filterProductCopy.sort((a, b) => (a.price - b.price)));
                break;
            case 'high-low':
                setFilterProducts(filterProductCopy.sort((a, b) => (b.price - a.price)));
                break;
            default:
                applyFilter();
                break;

        }

    }

    // useEffect(() => {
    //     setFilterProducts(products);
    // }, [])

    useEffect(() => {
        applyFilter();
    }, [products, category, search, sortType]);

    // useEffect(() => {
    //     sortProduct();
    // }, [sortType])



    return (

        <div>
            <SearchBar />
            <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-3 md:pt-10 border-t border-t-gray-300'>
                {/* Filters */}
                <div className='min-w-60'>
                    <p onClick={() => setShowFilter(!showFilter)} className='delius-unicase-regular my-2 text-xs md:text-base flex items-center gap-2 text-gray-700'> FILTERS
                        <img className={`h-2.5 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
                    </p>
                    {/* Category */}
                    <div className={`border border-gray-300 pl-5 py-3  my-2 mt-5  ${showFilter ? '' : 'hidden'} sm:block`}>
                        <p className='delius-unicase-regular mb-3 text-xs md:text-sm font-medium text-gray-700'>CATEGORIES</p>
                        <div className='flex flex-col gap-2 text-xs md:text-sm font-light text-gray-700'>
                            <p className=' flex gap-2'>
                                <input className='w-3 cursor-pointer' type='checkbox' value={'Tools & Utilities'} onChange={toggleCategory} /> Tools & Utility
                            </p>
                            <p className=' flex gap-2'>
                                <input className='w-3 cursor-pointer' type='checkbox' value={'Home & Office'} onChange={toggleCategory} /> Home & Office
                            </p>
                            <p className=' flex gap-2'>
                                <input className='w-3 cursor-pointer' type='checkbox' value={'Characters'} onChange={toggleCategory} /> Characters
                            </p>
                            <p className=' flex gap-2'>
                                <input className='w-3 cursor-pointer' type='checkbox' value={'Idols & Spirituality'} onChange={toggleCategory} /> Idols & Spirituality
                            </p>
                            <p className=' flex gap-2'>
                                <input className='w-3 cursor-pointer' type='checkbox' value={'Gaming'} onChange={toggleCategory} /> Gaming
                            </p>

                        </div>
                    </div>
                </div>

                {/* Items */}

                <div className='flex-1'>
                    <div className='flex justify-between text-base sm:text-2xl mb-4'>
                        <div className='text-left py-2 mb-4'>
                            <h1 className='delius-unicase-regular text-lg md:text-xl lg:text-xl font-normal text-gray-700'>
                                ALL PRODUCTS
                            </h1>
                            <hr className='w-12 md:w-16 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-23' />
                        </div>

                        {/* Sort Menu*/}

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3'>
                            <label htmlFor="sort-select" className='hidden md:inline-block md:text-base font-medium text-gray-700'>
                                Sort by :
                            </label>

                            <div className='relative'>
                                <select
                                    onChange={(e) => setSortType(e.target.value)}
                                    id="sort-select"
                                    className='border-2 border-gray-300 text-sm px-3 py-2 pr-8 bg-white'
                                >
                                    <option value="relevant">Relevance</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>

                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Products */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                        {
                            filterProducts.map((item, index) => (
                                <ProductItems
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    product={item}
                                />
                            ))}
                    </div>
                </div>

            </div >
        </div>
    )
}

export default Catalogue
