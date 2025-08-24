import React from 'react'

const About = () => {
    return (
        <div className='border-t border-gray-300'>
            <main className='pt-8 sm:pt-14 pb-12 sm:pb-16'>
                <section className=' mx-auto px-4'>
                    <div className='text-center mb-8'>
                        <h1 className='delius-unicase-regular text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-700 mb-4'>
                            ABOUT LAYERLY
                        </h1>
                        <div className='flex justify-center mb-8'>
                            <hr className='w-16 border-none h-[2px] bg-gray-500' />
                        </div>
                    </div>

                    <div className='space-y-6 text-gray-600 leading-relaxed'>
                        <p className='text-base sm:text-lg'>
                            Founded in 2024 within the vibrant environment of IIT Bhubaneswar's hostel rooms,
                            Layerly began as a student-driven initiative to support academic innovation by offering
                            accessible 3D printing solutions to students and faculty working on research and project development.
                            Layerly has expanded its mission to empower small-scale innovators, entrepreneurs,
                            and industrial partners with cutting-edge 3D printing services. <br />
                            Layerly now provides pre designed accessories that can be customised.
                            Head out to our catalogue for the glimpse of range of products available.
                        </p>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Our Mission
                            </h3>
                            <p className='text-base sm:text-lg mb-8'>
                                To empower creativity and innovation by providing accessible, high-quality 3D printing
                                solutions that inspire and enable our customers to transform their visions into reality.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Our Vision
                            </h3>
                            <p className='text-base sm:text-lg'>
                                To be the leading prototyping services provider using 3D printing, metal additive
                                manufacturing and laser operations recognized for excellence, innovation, and customer
                                satisfaction, shaping the future of manufacturing and design.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* CTA Section */}
            <div className='py-16 border rounded-xl sm:py-20 bg-gradient-to-bl from-gray-900 to-gray-500  text-white'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    <h2 className='text-2xl sm:text-3xl font-semibold mb-10'>
                        Ready to Bring Your Ideas to Life?
                    </h2>


                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <a
                            href="/catalogue"
                            className='bg-white text-gray-900 px-8 py-3 font-bold hover:bg-gray-100 transition-colors duration-200'
                        >
                            View Catalogue
                        </a>
                        <a
                            href="/custom"
                            className='border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-gray-900 transition-colors duration-200'
                        >
                            Custom Order
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
