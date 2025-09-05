import React, { useState, useEffect, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying') // verifying, success, error
    const [message, setMessage] = useState('')
    const { backendURL, login, navigate } = useContext(ShopContext)

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link')
            return
        }

        verifyEmail(token)
    }, [])

    const verifyEmail = async (token) => {
        try {
            const response = await axios.post(`${backendURL}/api/user/verify-email`, {
                token
            })

            if (response.data.success) {
                setStatus('success')
                setMessage(response.data.message)

                // Auto login user
                if (response.data.token) {
                    setTimeout(() => {
                        login(response.data.token)
                        navigate('/')
                    }, 2000)
                }

                toast.success('Email verified successfully!')
            }
        } catch (error) {
            setStatus('error')
            const errorMessage = error.response?.data?.message || 'Email verification failed'
            setMessage(errorMessage)
            toast.error(errorMessage)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 text-center'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                        Email Verification
                    </h1>
                </div>

                <div className='bg-white p-8 rounded-lg shadow-md'>
                    {status === 'verifying' && (
                        <div className='space-y-4'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                            <p className='text-gray-600'>Verifying your email address...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className='space-y-4'>
                            <div className='w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center'>
                                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                                </svg>
                            </div>
                            <p className='text-green-600 font-medium'>{message}</p>
                            <p className='text-gray-500 text-sm'>Redirecting you to home page...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className='space-y-4'>
                            <div className='w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center'>
                                <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                                </svg>
                            </div>
                            <p className='text-red-600 font-medium'>{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
