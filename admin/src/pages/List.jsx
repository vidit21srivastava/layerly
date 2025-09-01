import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const List = ({ setToken }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        productID: '',
        name: '',
        description: '',
        price: '',
        category: '',
        bestseller: false
    });
    const [editImages, setEditImages] = useState({
        white: null,
        black: null,
        gray: null,
        red: null,
        orange: null
    });

    const categories = [
        'Idols & Spirituality',
        'Home & Office',
        'Characters',
        'Tools & Utilities',
        'Gaming'
    ];

    const colors = ['White', 'Black', 'Gray', 'Red', 'Orange'];

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(backendURL + '/api/product/list');
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const removeProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                return;
            }

            const response = await axios.delete(`${backendURL}/api/product/remove/${id}`, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Product removed successfully');
                fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error removing product:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                if (setToken) setToken('');
                toast.error('Session expired. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to remove product');
            }
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product._id);
        setEditFormData({
            productID: product.productID,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            bestseller: product.bestseller
        });
        setEditImages({
            white: null,
            black: null,
            gray: null,
            red: null,
            orange: null
        });
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        setEditFormData({
            productID: '',
            name: '',
            description: '',
            price: '',
            category: '',
            bestseller: false
        });
        setEditImages({
            white: null,
            black: null,
            gray: null,
            red: null,
            orange: null
        });
    };

    const handleEditSubmit = async (e, productId) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                return;
            }

            // Get the original product to preserve availableColors
            const originalProduct = list.find(p => p._id === productId);

            const formData = new FormData();
            formData.append('productID', editFormData.productID);
            formData.append('name', editFormData.name);
            formData.append('description', editFormData.description);
            formData.append('price', editFormData.price);
            formData.append('category', editFormData.category);
            formData.append('bestseller', editFormData.bestseller);
            // Keep the original available colors
            formData.append('availableColors', JSON.stringify(originalProduct.availableColors || []));

            // Append images if they were changed
            Object.entries(editImages).forEach(([color, file]) => {
                if (file) {
                    formData.append(`image_${color.toLowerCase()}`, file);
                }
            });

            const response = await axios.put(
                `${backendURL}/api/product/update/${productId}`,
                formData,
                {
                    headers: {
                        'token': token
                    }
                }
            );

            if (response.data.success) {
                toast.success('Product updated successfully');
                cancelEditing();
                fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                if (setToken) setToken('');
                toast.error('Session expired. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update product');
            }
        }
    };

    const handleImageChange = (e, color) => {
        const file = e.target.files[0];
        if (file) {
            setEditImages(prev => ({
                ...prev,
                [color]: file
            }));
        }
    };

    const getFirstAvailableImage = (imagesByColor) => {
        if (!imagesByColor || typeof imagesByColor !== 'object') return null;

        const colorOrder = ['White', 'Black', 'Gray', 'Red', 'Orange'];
        for (const color of colorOrder) {
            if (imagesByColor[color]) {
                return imagesByColor[color];
            }
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl text-gray-800 font-bold mb-6">All Products</h2>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-400 text-gray-800 font-bold">
                            <th className="text-left p-3">Product ID</th>
                            <th className="text-left p-3">Image</th>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Category</th>
                            <th className="text-left p-3">Price</th>
                            <th className="text-left p-3">Bestseller</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <React.Fragment key={item._id}>
                                <tr className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="p-3">{item.productID}</td>
                                    <td className="p-3">
                                        <img
                                            src={getFirstAvailableImage(item.imagesByColor)}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3">₹{item.price}</td>
                                    <td className="p-3">
                                        <span className={`px-4 py-2 rounded-2xl text-md font-bold ${item.bestseller ? 'bg-amber-100 text-orange-700' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.bestseller ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="bg-gray-900 text-white px-3 py-1 font-bold rounded-lg mr-2 hover:bg-gray-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => removeProduct(item._id)}
                                            className="bg-gray-50 text-red-500 px-3 py-1 rounded font-bold border border-gray-50 hover:border-red-500"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                                {/* Edit Form Row */}
                                {editingProduct === item._id && (
                                    <tr>
                                        <td colSpan="7" className="p-4 bg-gray-50">
                                            <form onSubmit={(e) => handleEditSubmit(e, item._id)} className="space-y-4">
                                                <h3 className="text-lg  text-gray-800 font-bold mb-2">Edit Product</h3>

                                                {/* Images Upload Section */}
                                                <div>
                                                    <label className="block text-sm text-gray-700 font-medium mb-1">Click below to update images  (optional)</label>
                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                        {colors.map(color => (
                                                            <div key={color}>
                                                                <label className="block text-sm text-gray-700 font-medium mb-1">{color}</label>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(e, color.toLowerCase())}
                                                                    className="w-full text-sm text-gray-700 font-medium"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Product ID and Category Row - FIXED FLEX LAYOUT */}
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    {/* Product ID Section */}
                                                    <div className="flex-1 lg:flex-none lg:w-[55%]">
                                                        <label className="block text-sm text-gray-800 font-bold mb-1">Product ID</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.productID}
                                                            onChange={(e) => setEditFormData({ ...editFormData, productID: e.target.value })}
                                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                                            required
                                                        />
                                                    </div>

                                                    {/* Category Section */}
                                                    <div className="flex-1">
                                                        <label className="block text-sm  text-gray-800 font-bold mb-1">Category</label>
                                                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-3">
                                                            {categories.map(cat => (
                                                                <label key={cat} className="flex items-center cursor-pointer whitespace-nowrap">
                                                                    <input
                                                                        type="radio"
                                                                        name="edit-category"
                                                                        value={cat}
                                                                        checked={editFormData.category === cat}
                                                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                                                        required
                                                                        className="w-4 h-4 mr-2"
                                                                    />
                                                                    <span className="text-sm  text-gray-700">{cat}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Name and Price Row */}
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm  text-gray-800 font-bold mb-1">Name</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.name}
                                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="w-full md:w-48">
                                                        <label className="block text-sm  text-gray-800 font-bold mb-1">Price</label>
                                                        <input
                                                            type="number"
                                                            value={editFormData.price}
                                                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
                                                            required
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <label className="block text-sm  text-gray-800 font-bold mb-1">Description</label>
                                                    <textarea
                                                        value={editFormData.description}
                                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                                        rows="3"
                                                        required
                                                    />
                                                </div>

                                                {/* Bestseller Checkbox */}
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center text-gray-800 font-bold">
                                                        <input
                                                            type="checkbox"
                                                            checked={editFormData.bestseller}
                                                            onChange={(e) => setEditFormData({ ...editFormData, bestseller: e.target.checked })}
                                                            className="mr-2"
                                                        />
                                                        <span>Add to Bestseller</span>
                                                    </label>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        type="submit"
                                                        className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-rose-600 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {list.map((item) => (
                    <div key={item._id} className="border border-gray-300 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <img
                                src={getFirstAvailableImage(item.imagesByColor)}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600">ID: {item.productID}</p>
                                <p className="text-sm text-gray-600">{item.category}</p>
                                <p className="font-bold">₹{item.price}</p>
                                <span className={`inline-block px-2 py-1 rounded-2xl text-sm font-bold mt-1 ${item.bestseller ? 'bg-amber-100 text-orange-700' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {item.bestseller ? 'Bestseller' : 'Regular'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 ">
                            <button
                                onClick={() => startEditing(item)}
                                className="flex-1 bg-gray-900 text-white px-3 py-2 font-bold rounded-lg mr-2 "
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => removeProduct(item._id)}
                                className="flex-1 bg-gray-50 text-red-500 px-3 py-2 rounded-lg font-bold border border-red-500"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Mobile Edit Form */}
                        {editingProduct === item._id && (
                            <div className="pt-4 border-t border-gray-400">
                                <form onSubmit={(e) => handleEditSubmit(e, item._id)} className="space-y-3">
                                    <h3 className="text-lg text-gray-900 font-semibold">Edit Product</h3>

                                    <div>
                                        <label className="block text-sm text-gray-900 font-medium mb-1">Product ID</label>
                                        <input
                                            type="text"
                                            value={editFormData.productID}
                                            onChange={(e) => setEditFormData({ ...editFormData, productID: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-900 font-medium mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-900 font-medium mb-1">Price</label>
                                        <input
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-900 font-medium mb-1">Description</label>
                                        <textarea
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 "
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-900 font-medium mb-2">Category</label>
                                        <div className="space-y-2">
                                            {categories.map(cat => (
                                                <label key={cat} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="edit-category-mobile"
                                                        value={cat}
                                                        checked={editFormData.category === cat}
                                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                                        required
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editFormData.bestseller}
                                                onChange={(e) => setEditFormData({ ...editFormData, bestseller: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <span>Bestseller</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1  bg-amber-500 text-white px-3 py-2 font-bold rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEditing}
                                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {list.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No products found. Add some products to get started.
                </div>
            )}
        </div>
    );
};

export default List;
