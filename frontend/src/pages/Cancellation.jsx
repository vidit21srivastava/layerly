import React from 'react'

const Cancellation = () => {
    return (
        <div>
            <main className='pt-8 pb-12 sm:pb-16'>
                <section className=' mx-auto px-4'>
                    <div className='py-10 border rounded-xl sm:py-15 bg-gradient-to-bl from-brand-orange to-pink-600 text-white mb-4'>
                        <div className='max-w-4xl mx-auto px-4 text-center'>
                            <h1 className='text-2xl sm:text-5xl font-semibold'>
                                Refund & Cancellations
                            </h1>
                        </div>

                    </div>

                    <div className='space-y-6 text-gray-600 leading-relaxed'>
                        <strong className='text-md md:text-lg'>Updated on: 12/09/2025</strong>
                        <p className='text-base sm:text-lg'>
                            At Layerly, we aim to make your shopping experience seamless by offering straightforward options for refunds and cancellations, in compliance with Indian consumer protection laws.
                        </p>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Refund Eligibility Criteria
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li>Refunds are available for products that are damaged, defective, incorrect, or not as described upon delivery.</li>
                                <li>Non-refundable items include customized or personalized products, perishable goods, digital downloads, and items marked as final sale, unless they arrive damaged.</li>
                                <li>Refunds will only be processed if the returned item is in its original condition, with packaging and tags intact, and meets our quality inspection standards.</li>
                            </ul>

                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Exact Timelines
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li>Cancellations can be requested within 24 hours of order placement for unshipped orders; beyond this, cancellations are not permitted once processing begins.</li>
                                <li>Refunds for approved returns are initiated within 2-3 business days of receiving and inspecting the item, with funds credited back in 5-10 business days depending on the payment method (e.g., bank transfers may take longer).</li>



                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Non-Refundable Fees
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>

                                <li>Shipping fee is non-refundable unless the return is due to our error (e.g., wrong item shipped).</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Cancellation Processes
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>


                                <li>
                                    To cancel the order, contact our team via email at <a href="mailto:layerly2024@gmail.com" className="text-blue-600">team.layerly@gmail.com</a> (recommended / response within 12 hour) or call us at +91 96648 51323 (Mon-Sat, 10am-7pm) with the order ID and reason; confirmation will be sent via email.
                                </li>
                                <li>
                                    For refunds on returns, we initiate a return request as per our Return Policy, and once approved, the refund will be processed automatically after inspection.
                                </li>
                                <li>In case of disputes, we follow the Consumer Protection Act, 2019, and may require proof of purchase or photos of the issue.</li>

                            </ul>
                        </div>



                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Support and Contact Information
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>

                                <li>Contact our team via email at <a href="mailto:layerly2024@gmail.com" className="text-blue-600">team.layerly@gmail.com</a> (recommended / response within 12 hour) or call us at +91 96648 51323 (Mon-Sat, 10am-7pm).</li>

                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Cancellation