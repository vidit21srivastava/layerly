import React, { useState } from "react";
import { assets } from "../assets/assets";

const Policy = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Policies</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center">
                            <img
                                src={assets.quality_icon}
                                alt="Quality"
                                className="w-12 h-12"
                            />
                            <p className="text-gray-700 font-semibold text-md">
                                High Quality 3D Prints
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center">
                            <img
                                src={assets.fastforward}
                                alt="FastForward"
                                className="w-12 h-12"
                            />
                            <p className="text-gray-700 font-semibold text-sm">
                                Fast-Forward Processing of Orders
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center">
                            <img
                                src={assets.moneysaving}
                                alt="Saving"
                                className="w-12 h-12"
                            />
                            <p className="text-gray-700 font-semibold text-sm">
                                Most Affordable Pricing
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center">
                            <img
                                src={assets.support_img}
                                alt="Support"
                                className="w-12 h-12"
                            />
                            <p className="text-gray-700 font-semibold text-sm">
                                Contact us at Ease
                            </p>
                        </div>
                    </div>
                </div>


                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(0)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                What are the Return & Refund Policies?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 0 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 0 && (
                                <div className="px-5 pb-4 text-sm text-gray-600">
                                    <p>We ship all products only after thorough inspection and therefore do not accept returns. However, if your order arrives damaged due to shipping, please email clear photos of the damage within 24 hours of delivery to <a href="mailto:layerly2024@gmail.com" className="text-blue-600">layerly2024@gmail.com</a> (as listed in the Contact section). For refunds, include your order number and your bank account or UPI details in the email. Once the refund is initiated, you will receive an email notification. The amount may reflect in your account within 1–2 working days.</p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(1)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                How long does Delivery take?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 1 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 1 && (
                                <div className="px-5 pb-4 text-sm text-gray-600">
                                    <p>Orders are usually delivered within 5–7 working days, depending on your location.</p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(2)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                Can I cancel my Order once Placed?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 2 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 2 && (
                                <div className="px-5 pb-4 text-sm text-gray-600 ">
                                    <p>To cancel your order, you must call us at +91 96648 51323 (as listed in the Contact section). If order processing has not yet begun, we may provide a refund. For refunds, please email us your bank account or UPI details along with your Order ID.</p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(3)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                How long does Order Processing takes?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 3 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 3 && (
                                <div className="px-5 pb-4 text-sm text-gray-600 ">
                                    <p>Order processing begins within 24–48 hours of order placement. You will receive an email notification when processing starts.</p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(4)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                How to add information for Customizable items?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 4 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 4 && (
                                <div className="px-5 pb-4 text-sm text-gray-600 ">
                                    <p>At checkout, enter the text to be printed in the Info field. For multiple items, format it as "Product_Name - Text_to_be_printed".</p>
                                </div>
                            )}
                        </div>
                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                                onClick={() => toggleFAQ(5)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                            >
                                What are the Terms of Service?
                                <img
                                    src={assets.dropdown_icon}
                                    alt="Toggle"
                                    className={`w-3 transition-transform duration-300 ${openIndex === 4 ? "rotate-270" : "rotate-90"}`}
                                />
                            </button>
                            {openIndex === 5 && (
                                <div className="px-5 pb-4 text-sm text-gray-600 ">
                                    <p>For detailed information refer to the link mentioned in the Company section at the end of this page.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Policy;
