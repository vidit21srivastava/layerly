import React, { useState, useEffect } from 'react'
import { backendURL } from '../App';
import axios from 'axios';

const Add = ({ setToken }) => {
    const [image_white, setImageW] = useState(null);
    const [image_black, setImageB] = useState(null);
    const [image_gray, setImageG] = useState(null);
    const [image_red, setImageR] = useState(null);
    const [image_orange, setImageO] = useState(null);

    const [imageUrls, setImageUrls] = useState({
        white: null,
        black: null,
        gray: null,
        red: null,
        orange: null
    });

    const [productID, setProductID] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [bestseller, setBestseller] = useState(false);


    const [availableColors] = useState(['White', 'Black', 'Gray', 'Red', 'Orange']);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        return () => {
            Object.values(imageUrls).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    const handleImageChange = (file, color, setter) => {
        if (file) {
            if (imageUrls[color]) {
                URL.revokeObjectURL(imageUrls[color]);
            }

            const objectUrl = URL.createObjectURL(file);
            setter(file);
            setImageUrls(prev => ({
                ...prev,
                [color]: objectUrl
            }));
        }
    };

    const UploadIcon = ({ size = "sm" }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size === "sm" ? "32" : "48"}
            height={size === "sm" ? "32" : "48"}
            fill="currentColor"
            className="text-gray-400"
            viewBox="0 0 16 16"
        >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 0 1-.708-.708z" />
        </svg>
    );


    const UploadArea = ({ id, color, image, imageUrl, onChange, label }) => (
        <label htmlFor={id} className="cursor-pointer group">
            <div className="aspect-square w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 p-2 sm:p-4 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${color} preview`}
                        className="w-full h-full object-cover rounded"
                    />
                ) : (
                    <>
                        <UploadIcon size="sm" />
                        <span className="text-sm text-gray-500 mt-1 sm:mt-2 group-hover:text-gray-600 text-center leading-tight">
                            {label}
                        </span>
                    </>
                )}
            </div>
            <input
                onChange={(e) => onChange(e.target.files[0], color, image)}
                type="file"
                id={id}
                hidden
                accept="image/*"
            />
        </label>
    );

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!productID || !name || !price || !description || !category) {
                setError("Please fill in all required fields");
                setLoading(false);
                return;
            }

            const adminToken = localStorage.getItem('token');

            if (!adminToken) {
                setError("Authentication token not found. Please login again.");
                setLoading(false);
                return;
            }

            const formData = new FormData();

            formData.append("productID", productID);
            formData.append("name", name);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("bestseller", bestseller);
            formData.append("availableColors", JSON.stringify(availableColors));

            if (image_white) formData.append("image_white", image_white);
            if (image_black) formData.append("image_black", image_black);
            if (image_gray) formData.append("image_gray", image_gray);
            if (image_red) formData.append("image_red", image_red);
            if (image_orange) formData.append("image_orange", image_orange);

            // Axios API call
            const response = await axios.post(backendURL + '/api/product/add', formData, {
                headers: {
                    'token': adminToken
                }
            });

            const data = response.data;

            if (data.success) {
                setSuccess("Product added successfully!");

                setProductID("");
                setName("");
                setPrice("");
                setDescription("");
                setCategory("");
                setBestseller(false);
                setImageW(null);
                setImageB(null);
                setImageG(null);
                setImageR(null);
                setImageO(null);
                setImageUrls({
                    white: null,
                    black: null,
                    gray: null,
                    red: null,
                    orange: null
                });
            } else {
                setError(data.message || "Failed to add product");
            }
        } catch (error) {
            console.error("Error adding product:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                if (status === 401) {
                    localStorage.removeItem('token');
                    if (setToken) {
                        setToken('');
                    }
                    setError("Session expired. Please login again.");
                } else {
                    setError(message || "Failed to add product");
                }
            } else if (error.request) {
                setError("Network error. Please try again.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="p-3 sm:p-6 max-w-7xl mx-auto">

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {/* Images Section */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload Images</h3>


            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 mb-4">
                <UploadArea
                    id="image_white"
                    color="white"
                    image={setImageW}
                    imageUrl={imageUrls.white}
                    onChange={handleImageChange}
                    label="Click to upload (White)"
                />

                <UploadArea
                    id="image_black"
                    color="black"
                    image={setImageB}
                    imageUrl={imageUrls.black}
                    onChange={handleImageChange}
                    label="Click to upload (Black)"
                />

                <UploadArea
                    id="image_gray"
                    color="gray"
                    image={setImageG}
                    imageUrl={imageUrls.gray}
                    onChange={handleImageChange}
                    label="Click to upload (Gray)"
                />

                <UploadArea
                    id="image_red"
                    color="red"
                    image={setImageR}
                    imageUrl={imageUrls.red}
                    onChange={handleImageChange}
                    label="Click to upload (Red)"
                />

                <UploadArea
                    id="image_orange"
                    color="orange"
                    image={setImageO}
                    imageUrl={imageUrls.orange}
                    onChange={handleImageChange}
                    label="Click to upload (Orange)"
                />
            </div>
            {/* Product ID Field */}

            <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                <div className="flex-1 lg:flex-none lg:w-[45%] space-y-2">
                    <label className="block text-md font-bold text-gray-800">
                        Product ID *
                    </label>
                    <input
                        onChange={(e) => setProductID(e.target.value)}
                        value={productID}
                        type="text"
                        placeholder="ALL CAPS 3-alphabets-3-numbers (ex: XYZ123) for personal tracking purpose."
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400"
                    />
                </div>

                <div className="flex-1 lg:w-2/3 space-y-2">
                    <label className="block text-md font-bold text-gray-800">
                        Product Category *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="Idols & Spirituality"
                                checked={category === "Idols & Spirituality"}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-sm text-gray-700 whitespace-nowrap">Idols & Spirituality</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="Home & Office"
                                checked={category === "Home & Office"}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-sm text-gray-700 whitespace-nowrap">Home & Office</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="Characters"
                                checked={category === "Characters"}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-sm text-gray-700 whitespace-nowrap">Characters</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="Tools & Utilities"
                                checked={category === "Tools & Utilities"}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-sm text-gray-700 whitespace-nowrap">Tools & Utilities</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="Gaming"
                                checked={category === "Gaming"}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-sm text-gray-700 whitespace-nowrap">Gaming</span>
                        </label>
                    </div>
                </div>
            </div>




            <div className="mt-5 space-y-6">
                {/* Name and Price Row */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                        <label className="block text-md font-bold text-gray-800">
                            Product Name *
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder="Enter product name"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400"
                        />
                    </div>

                    <div className="flex-1 md:flex-none md:w-48 space-y-2">
                        <label className="block text-md font-bold text-gray-800">
                            Price *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                required
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-md font-bold text-gray-800">
                        Product Description *
                    </label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Provide product description..."
                        required
                        rows="4"
                        maxLength="1000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 resize-vertical"
                    />
                </div>

                {/* Bestseller */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="lg:mr-8">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="bestseller"
                                checked={bestseller}
                                onChange={(e) => setBestseller(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="ml-3 text-md text-gray-700 whitespace-nowrap">Add to Bestseller</span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 md:pt-0">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-16 py-3 md:px-8 rounded-lg font-bold shadow-sm transition-colors duration-200 ${loading
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-gray-900 text-white hover:bg-gray-700'
                                }`}
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </div>

            </div>
        </form>
    );
};

export default Add;
