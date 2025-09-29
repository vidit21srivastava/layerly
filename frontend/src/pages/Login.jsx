import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

const Login = () => {
    const [currentState, setCurrentState] = useState('Sign Up');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');

    const { backendURL, login, navigate, token } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    useEffect(() => {

        if (token) {
            navigate('/');
            return;
        }


        const error = searchParams.get('error');
        if (error === 'auth_failed') {
            toast.error('Google authentication failed');
        } else if (error === 'auth_error') {
            toast.error('Authentication error occurred');
        }
    }, [token, navigate, searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (currentState === 'Sign Up') {
            if (!formData.name.trim()) {
                toast.error('Name is required');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return false;
            }
            if (formData.password.length < 8) {
                toast.error('Password must be at least 8 characters long');
                return false;
            }
        }

        if (!formData.email.trim()) {
            toast.error('Email is required');
            return false;
        }

        if (!formData.password.trim()) {
            toast.error('Password is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (currentState === 'Sign Up') {
                const response = await axios.post(`${backendURL}/api/user/register`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                    setPendingEmail(formData.email);
                    setNeedsVerification(true);
                    setCurrentState('Login');
                    setFormData({
                        name: '',
                        email: formData.email,
                        password: '',
                        confirmPassword: ''
                    });
                }
            } else {
                const response = await axios.post(`${backendURL}/api/user/login`, {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    login(response.data.token, response.data.user);
                    toast.success('Login successful!');
                    navigate('/');
                } else if (response.data.needsVerification) {
                    setPendingEmail(formData.email);
                    setNeedsVerification(true);
                    toast.warning(response.data.message);
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);

            if (error.response?.data?.needsVerification) {
                setPendingEmail(formData.email);
                setNeedsVerification(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!pendingEmail) return;

        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/api/user/resend-verification`, {
                email: pendingEmail
            });

            if (response.data.success) {
                toast.success('Verification email sent!');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to resend verification email';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/api/user/forgot-password`, {
                email: formData.email
            });

            if (response.data.success) {
                toast.success('Password reset link sent to your email');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        window.location.href = `${backendURL}/api/user/auth/google`;
    };

    return (
        <div className='border-t border-gray-300'>
            <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 text-gray-700 pt-5'>
                <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                    <p className='text-3xl md:text-4xl text-gray-700 font-bold'>{currentState}</p>
                </div>

                {needsVerification && (
                    <div className='w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4'>
                        <p className='text-sm text-yellow-800 mb-2'>
                            Please verify your email address ({pendingEmail}) to continue.
                        </p>
                        <button
                            onClick={handleResendVerification}
                            disabled={loading}
                            className='text-sm text-blue-600 hover:text-blue-800 underline'
                        >
                            {loading ? 'Sending...' : 'Resend verification email'}
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4'>
                    {currentState === 'Sign Up' && (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none'
                            placeholder='Full Name'
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border  border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none'
                        placeholder='Email'
                        required
                    />

                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none'
                            placeholder='Password'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 px-3 flex items-center text-gray-600'
                        >
                            {showPassword ? <img className='w-4' src='https://img.icons8.com/?size=100&id=85028&format=png&color=000000' /> : <img className='w-4' src='https://img.icons8.com/?size=100&id=85035&format=png&color=000000' />}
                        </button>
                    </div>

                    {currentState === 'Sign Up' && (
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none'
                                placeholder='Confirm Password'
                                required
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute inset-y-0 right-0 px-3 flex items-center text-gray-600'
                            >
                                {showConfirmPassword ? <img className='w-4' src='https://img.icons8.com/?size=100&id=85028&format=png&color=000000' /> : <img className='w-4' src='https://img.icons8.com/?size=100&id=85035&format=png&color=000000' />}
                            </button>
                        </div>
                    )}

                    <div className='w-full flex justify-between text-sm mt-[-8px]'>
                        {currentState === 'Login' && (
                            <button
                                type='button'
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className='text-blue-600 hover:text-blue-800 underline cursor-pointer'
                            >
                                Forgot password?
                            </button>
                        )}
                        <div className='flex-1'></div>
                        {currentState === 'Login' ?
                            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-blue-600 hover:text-blue-800 underline'>
                                Create account
                            </p> :
                            <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-blue-600 hover:text-blue-800 underline'>
                                Login here
                            </p>
                        }
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full mt-4 py-2 px-4 rounded font-medium ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                            } transition-colors`}
                    >
                        {loading ? 'Please wait...' : currentState}
                    </button>
                </form>

                <div className='w-full flex items-center gap-4 my-4'>
                    <div className='flex-1 border-t border-gray-300'></div>
                    <span className='text-gray-500 text-sm'>OR</span>
                    <div className='flex-1 border-t border-gray-300'></div>
                </div>

                <button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className='w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
