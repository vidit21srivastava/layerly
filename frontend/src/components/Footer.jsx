import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-8 lg:gap-14 py-12 mt-10'>

                    {/* Company Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <img src={assets.logo_slogan} className='w-36 object-contain' alt="Company Logo" />

                        </div>
                        <p className='w-full md:w-4/5 text-gray-600 leading-relaxed text-sm'>
                            Embark on a journey of 3D printing with Layerly! Personalize, innovate, and turn your ideas into reality with us.

                            Browse our curated catalogue for a range of pre-designed accessories, from your daily chores to specific needs.

                            Prefer a unique touch? Upload your design to our Custom 3D Print section and experience the joy of bringing your vision to life—exactly as you imagined.<br />

                            We Design, Develop, Deliver - one layer at a time.
                        </p>

                        {/* Yet to add links here */}
                        <div className="flex items-center space-x-4 pt-2">
                            <span className="text-xs text-gray-500">Follow us:</span>
                            <div className="flex space-x-3">
                                <a href='https://www.instagram.com/l.a.y.e.r.l.y?igsh=NHlhNjNqMDNlaGg4'>
                                    <img src={assets.instagram} className='w-6' />
                                </a>
                                <a href='https://www.linkedin.com/company/layerly3d/posts/?feedView=all'>
                                    <img src={assets.linkedin} className='w-6' />
                                </a>
                                <a><img src={assets.xcom} className='w-6' />
                                </a>


                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className='text-sm font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2'>
                            Company
                        </h3>
                        <ul className='space-y-3'>
                            {[
                                { text: 'Home', href: '/' },
                                { text: 'About Us', href: '/about' },
                                { text: 'Privacy Policy', href: 'https://drive.google.com/file/d/1O8KuMVZCtDtBtt9LVbNJTmvzm0e_bCZR/view?usp=sharing' },
                                { text: 'Terms of Service', href: 'https://drive.google.com/file/d/1kEuwZ05TV9xh1cMKbw8t-6m9r9j49FwA/view?usp=sharing' }
                            ].map((item, index) => (
                                <li key={index}>
                                    <a href={item.href} className='text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center group'>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {item.text}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className='text-sm font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-2'>
                            Contact Us
                        </h3>
                        <ul className='space-y-3'>
                            <li className='text-sm text-gray-600 flex items-start'>
                                <span className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0"><img src={assets.mail} /></span>
                                <a href='mailto:layerly2024@gmail.com'><span>layerly2024@gmail.com</span></a>
                            </li>
                            <li className='text-sm text-gray-600 flex items-start'>
                                <span className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0"><img src={assets.phone} /></span>
                                <span>+91 96648 51323</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className="text-xs text-gray-600">
                            © {new Date().getFullYear()} Layerly. All rights reserved.
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
