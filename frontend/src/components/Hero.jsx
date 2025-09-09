import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col sm:flex-row border border-gray-200 rounded-xl bg-gray-200 overflow-hidden'>

            <div className='w-full sm:w-1/2 flex flex-col justify-center p-10 sm:p-12'>

                <div className='text-left mb-6'>
                    <div className='text-left text-brand-orange text-4xl sm:text-4xl md:text-5xl leading-tight'>
                        <h1 id='hero-heading'>
                            Design
                        </h1>
                        <h1 id='hero-heading'>
                            Develop
                        </h1>
                        <h1 id='hero-heading'>
                            Deliver
                        </h1>
                    </div>

                    <h1 className='flex flex-col text-gray-600 ubuntu-sans-mono-italic  mt-6 text-md lg:text-xl sm:text-base max-w-md'>
                        — step by step, one layer at a time.

                    </h1>
                </div>

                {/* Button Container - Left Aligned */}
                <div className='flex justify-start gap-4'>
                    <button
                        className="bg-gray-800 font-sans text-gray-200 text-sm md:text-lg px-3 py-3 md:px-6 md:py-3 font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => navigate('/catalogue')}
                    >
                        Shop Now
                    </button>
                    <button
                        className="bg-tranparent font-sans text-gray-800 border-2 border-gray-800 text-sm md:text-lg px-3 py-3 md:px-6 md:py-3 font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => navigate('/custom')}
                    >
                        Order Custom
                    </button>
                </div>
            </div>

            {/* Image Section - Right Aligned */}
            <div className='w-full sm:w-1/2 flex items-center justify-center'>
                <img
                    className='w-full h-full object-cover rounded-r-xl'
                    src={assets.poster_left}
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default Hero

