import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, token, backendURL, logout, getUserProfile, navigate } = useContext(ShopContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India'
        }
    });

    const [pwdOpen, setPwdOpen] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdData, setPwdData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    pinCode: user.address?.pinCode || '',
                    country: user.address?.country || 'India'
                }
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${backendURL}/api/user/profile`, {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            }, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                getUserProfile();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    pinCode: user.address?.pinCode || '',
                    country: user.address?.country || 'India'
                }
            });
        }
        setIsEditing(false);
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (pwdData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setPwdLoading(true);
        try {
            const payload = {
                newPassword: pwdData.newPassword
            };

            if (user?.hasGoogleAccount !== true) {
                payload.currentPassword = pwdData.currentPassword;
            }
            const res = await axios.put(`${backendURL}/api/user/password`, payload, {
                headers: { token }
            });
            if (res.data.success) {
                toast.success(res.data.message || 'Password updated successfully');
                setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPwdOpen(false);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update password';
            toast.error(msg);
        } finally {
            setPwdLoading(false);
        }
    };

    if (!user) {
        return (
            <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
                <div className='text-center py-12'>
                    <h2 className='text-2xl text-gray-600 mb-4'>Please login to view your profile</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors'
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='pt-8 sm:pt-14 border-t border-t-gray-300'>
            <div className='max-w-2xl mx-auto'>
                <div className='mb-6'>
                    <h1 className='delius-unicase-regular text-lg sm:text-lg lg:text-xl font-normal text-gray-700'>
                        MY PROFILE
                    </h1>
                    <hr className='w-12 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-16 md:ml-19' />
                </div>

                <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-4'>
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className='w-16 h-16 rounded-full object-cover border border-gray-200' />
                            ) : (
                                <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                                    <span className='text-xl font-semibold text-gray-600'>
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h2 className='text-xl font-semibold text-gray-900'>{user.name}</h2>
                                <p className='text-gray-600'>{user.email}</p>
                                <div className='flex items-center gap-2 mt-1'>
                                    {user.isEmailVerified ? (
                                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                            Verified ✓
                                        </span>
                                    ) : (
                                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                                            Unverified
                                        </span>
                                    )}
                                    {user.hasGoogleAccount && (
                                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                            Google
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className='flex justify-end gap-2'>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='bg-gray-900 text-white px-4 py-2 font-bold rounded-lg hover:bg-gray-700 transition-colors text-sm '
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleCancel}
                                className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium'
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <h3 className='text-lg font-medium text-gray-900 mb-4'>Personal Information</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                    <input
                                        type='email'
                                        value={user.email}
                                        disabled
                                        className='w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                        placeholder='+91 9876543210'
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className='text-lg font-medium text-gray-900 mb-4'>Address Information</h3>
                            <div className='grid grid-cols-1 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Street Address</label>
                                    <input
                                        type='text'
                                        name='address.street'
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                        placeholder='House No., Street Name'
                                    />
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                                        <input
                                            type='text'
                                            name='address.city'
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                            placeholder='City'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                                        <input
                                            type='text'
                                            name='address.state'
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                            placeholder='State'
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>PIN Code</label>
                                        <input
                                            type='text'
                                            name='address.pinCode'
                                            value={formData.address.pinCode}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                            placeholder='123456'
                                            maxLength='6'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                                        <input
                                            type='text'
                                            name='address.country'
                                            value={formData.address.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                                            placeholder='India'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className='flex justify-end'>
                                <button type='submit' disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} transition-colors`}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Account Actions */}
                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>Account Actions</h3>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <button
                            onClick={logout}
                            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold'
                        >
                            Logout
                        </button>

                        <button
                            onClick={() => setPwdOpen(!pwdOpen)}
                            className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-bold'
                        >
                            {pwdOpen ? 'Close Password Change' : 'Change Password'}
                        </button>
                    </div>

                    {pwdOpen && (
                        <form onSubmit={submitPasswordChange} className='mt-4 bg-white border border-gray-200 rounded-lg p-4 space-y-3'>
                            {!user?.hasGoogleAccount && (
                                <div>
                                    <label className='block text-sm font-bold text-gray-700 mb-1'>Current Password</label>
                                    <input
                                        type='password'
                                        value={pwdData.currentPassword}
                                        onChange={(e) => setPwdData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500'
                                        placeholder='Enter current password'
                                        required
                                    />
                                </div>
                            )}
                            {user?.hasGoogleAccount && (
                                <p className='text-xs text-gray-600'>
                                    You signed up with Google. You can set a new password here to enable email/password login.
                                </p>
                            )}
                            <div>
                                <label className='block text-sm font-bold text-gray-700 mb-1'>New Password</label>
                                <input
                                    type='password'
                                    value={pwdData.newPassword}
                                    onChange={(e) => setPwdData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500'
                                    placeholder='Enter new password (min 8 characters)'
                                    minLength={8}
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-bold text-gray-700 mb-1'>Confirm New Password</label>
                                <input
                                    type='password'
                                    value={pwdData.confirmPassword}
                                    onChange={(e) => setPwdData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500'
                                    placeholder='Confirm new password'
                                    minLength={8}
                                    required
                                />
                            </div>
                            <div className='flex justify-end'>
                                <button type='submit' disabled={pwdLoading}
                                    className={`px-6 py-2 rounded-lg font-bold ${pwdLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-colors`}>
                                    {pwdLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
