import React, { useState, useEffect, useContext } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { navigate, backendUrl, setToken } = useContext(ShopContext);

    // Timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = currentState === 'Login' ? '/api/user/login' : '/api/user/register';
            const response = await axios.post(backendUrl + endpoint, formData);

            if (response.data.success) {
                if (currentState === 'Login') {
                    // Login successful
                    localStorage.setItem('token', response.data.token);
                    setToken(response.data.token);
                    toast.success('Login successful!');
                    navigate('/');
                } else {
                    // Registration successful - show OTP
                    setUserId(response.data.userId);
                    setShowOTP(true);
                    setResendTimer(60); // 60 seconds timer
                    toast.success('Registration successful! Please verify your email.');
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(backendUrl + '/api/user/verify-otp', {
                userId,
                otp
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                toast.success('Email verified successfully!');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setIsLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/user/resend-otp', {
                userId
            });

            if (response.data.success) {
                toast.success('OTP sent successfully!');
                setResendTimer(60);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(backendUrl + '/api/user/google-login', {
                credential: credentialResponse.credential
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                toast.success('Login successful!');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Google login failed');
        }
    };

    if (showOTP) {
        return (
            <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
                <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                    <p className='text-3xl md:text-4xl font-semibold'>Verify Email</p>
                </div>

                <p className='text-center text-gray-600 mb-4'>
                    We've sent a verification code to<br />
                    <span className='font-medium'>{formData.email}</span>
                </p>

                <form onSubmit={handleOTPSubmit} className='w-full'>
                    <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-xl tracking-widest'
                        placeholder='Enter 6-digit OTP'
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 6) setOTP(value);
                        }}
                        maxLength='6'
                        required
                    />

                    <button
                        type='submit'
                        disabled={isLoading || otp.length !== 6}
                        className='w-full mt-4 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300'
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className='flex items-center justify-between w-full mt-2'>
                    <button
                        onClick={() => {
                            setShowOTP(false);
                            setOTP('');
                        }}
                        className='text-sm text-gray-600 hover:text-gray-800'
                    >
                        ← Back
                    </button>

                    <button
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className='text-sm text-orange-500 hover:text-orange-600 disabled:text-gray-400'
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
                <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                    <p className='text-3xl md:text-4xl font-semibold'>{currentState}</p>
                </div>

                {currentState === 'Sign Up' && (
                    <input
                        type='text'
                        name='name'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        placeholder='Name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                )}

                <input
                    type='email'
                    name='email'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />

                <input
                    type='password'
                    name='password'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                {currentState === 'Login' && (
                    <div className='w-full text-right'>
                        <a href='#' className='text-sm text-gray-600 hover:text-gray-800'>
                            Forgot Password?
                        </a>
                    </div>
                )}

                <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300'
                >
                    {isLoading ? 'Loading...' : currentState === 'Login' ? 'Login' : 'Create Account'}
                </button>

                <div className='relative w-full'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-300'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='px-2 bg-white text-gray-500'>OR</span>
                    </div>
                </div>

                <div className='w-full'>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error('Google login failed')}
                        useOneTap
                        theme='outline'
                        size='large'
                        width='100%'
                        text={currentState === 'Login' ? 'signin_with' : 'signup_with'}
                    />
                </div>

                <p className='text-sm text-gray-600'>
                    {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type='button'
                        onClick={() => {
                            setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login');
                            setFormData({ name: '', email: '', password: '' });
                        }}
                        className='text-orange-500 hover:text-orange-600 font-medium'
                    >
                        {currentState === 'Login' ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </form>
        </GoogleOAuthProvider>
    )
}

export default Login
