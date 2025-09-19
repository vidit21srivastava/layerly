import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div>
            <main className='pt-8 pb-12 sm:pb-16'>
                <section className=' mx-auto px-4'>
                    <div className='py-10 border rounded-xl sm:py-15 bg-gradient-to-bl from-brand-orange to-pink-600 text-white mb-4'>
                        <div className='max-w-4xl mx-auto px-4 text-center'>
                            <h1 className='text-2xl sm:text-5xl font-semibold'>
                                Privacy Policy
                            </h1>
                        </div>

                    </div>

                    <div className='space-y-6 text-gray-600 leading-relaxed'>
                        <strong className='text-md md:text-lg'>Updated on: 12/09/2025</strong>
                        <p className='text-base sm:text-lg'>
                            At Layerly, we are committed to protecting your privacy and handling your personal information responsibly. This policy applies to all users of our website and services, and we reserve the right to update it, with changes effective upon posting.
                        </p>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                What User Data is Collected?
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li><strong>Personal Information: </strong>We collect details you provide, such as name, email address, phone number, shipping/billing address, and payment information (e.g., credit card details, processed securely via third-party gateways).</li>
                                <li><strong>Automatically Collected Data: </strong>This includes IP address, and location data derived from your interactions with our site.</li>
                                <li><strong>Other Data: </strong>Purchase history, preferences, and feedback; for 3D printing services, this may include design files or customization details you upload.</li>
                            </ul>

                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                How Data is Stored and Shared?
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>
                                <li><strong>Storage:</strong> Data is stored on secure servers in India or compliant cloud services, with encryption and access controls to prevent unauthorized access. We retain data only as long as necessary for business purposes or legal requirements, typically up to 5 years for transaction records.</li>
                                <li><strong>Sharing:</strong> We share data with trusted third parties, such as payment processors, shipping partners, and analytics providers, solely for order fulfillment, fraud prevention, or service improvement. We do not sell your data to third parties, and sharing is limited to what is necessary, with agreements ensuring data protection.</li>
                                <li><strong>Legal Sharing:</strong> Data may be disclosed if required by law, such as for government requests or dispute resolution.</li>


                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                How Data is Used?
                            </h3>

                            <ul className='list-disc ml-6 text-base sm:text-lg mb-8'>

                                <li>To process orders, manage accounts, provide customer support, and personalize recommendations (e.g., suggesting 3D printing products based on past purchases).</li>
                                <li>For marketing (with your consent), such as sending newsletters or promotions, and for analytics to improve our site.</li>
                                <li>To ensure security, prevent fraud, and comply with legal obligations.</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Cookie Usage and Management
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>


                                We use cookies and similar technologies (e.g.,local storage) for essential functions like maintaining your session, remembering preferences, and tracking site usage.


                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Your Rights and Choices
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>
                                <li>Access, correct, or delete your data by contacting us; withdraw consent for marketing at any time via email unsubscribe or account settings.</li>
                                <li>Under Indian law, you have rights to data portability and to object to processing; we respond to requests within 30 days.</li>
                                <li>For children under 18, we do not knowingly collect data without parental consent; contact us if you believe we have such data.</li>

                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Security Measures
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>

                                We implement industry-standard safeguards like SSL encryption, firewalls, and regular audits to protect against breaches. However, no system is entirely risk-free, and we notify users of any incidents as required by law.
                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-1'>
                                Changes to This Policy
                            </h3>
                            <ul className='list-disc ml-6 text-base sm:text-lg'>

                                We may update this policy; the latest version will be posted here with the effective date. Continued use of the site constitutes acceptance.
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

export default PrivacyPolicy