import React from 'react'

const Shipping = () => {
    return (
        <div>
            <main className='pt-8 pb-12 sm:pb-16'>
                <section className=' mx-auto px-4'>
                    <div className='py-10 border rounded-xl sm:py-15 bg-gradient-to-bl from-brand-orange to-pink-600 text-white mb-4'>
                        <div className='max-w-4xl mx-auto px-4 text-center'>
                            <h1 className='text-2xl sm:text-5xl font-semibold'>
                                Shipping Policy
                            </h1>
                        </div>

                    </div>

                    <div className='space-y-6 text-gray-600 leading-relaxed text-justify'>
                        <strong className='text-md md:text-lg'>Updated on: 12/09/2025</strong>
                        <p className='text-base sm:text-lg'>
                            We strive to deliver your orders efficiently and reliably through trusted courier partners, with a focus on transparency and customer satisfaction.
                        </p>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Available Shipping Options
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li><strong>Standard Shipping: </strong>Ideal for most orders, handled via partners like Delhivery or India Post, suitable for non-urgent deliveries.</li>
                                <li>For urgent deliveries you have to contact us, and additional shipping charges will be informed to you.</li>

                            </ul>

                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Estimated Delivery Timelines
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li>Orders are processed within 24-48 hours after confirmation, excluding weekends and public holidays.</li>
                                <li><strong>Standard Shipping:</strong> 3-7 business days within India, depending on the destination </li>


                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Shipping Costs
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>

                                <li>Costs are calculated at checkout based on order weight, dimensions, and destination; standard shipping starts at ₹60 for orders under 1kg. </li>
                                <li>Additional fees apply for remote areas or express deliveries.</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Order Tracking Instructions
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>

                                <li>Once shipped, you'll receive a confirmation email.</li>
                                <li>Log in to your account on our website under "My Orders" to view real-time status updates.</li>
                                <li>For issues like delays or non-delivery, contact us at at <a href="mailto:layerly2024@gmail.com" className="text-blue-600">team.layerly@gmail.com</a> immediately with your order ID.</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Additional Terms
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>
                                <li>We ship to all pincodes in India.</li>
                                <li>In case of damaged or lost shipments, report within 24 hours of delivery attempt for investigation and resolution.</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Support and Contact Information
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>

                                <li>For assistance, contact our team via email at <a href="mailto:layerly2024@gmail.com" className="text-blue-600">team.layerly@gmail.com</a> (recommended / response within 12 hour) or call us at +91 96648 51323 (Mon-Sat, 10am-7pm).</li>
                                <li>Our team will assist you through every stage of the return process.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Shipping