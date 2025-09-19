import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const navigate = useNavigate()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

    useEffect(() => {
        const resetToken = searchParams.get('token')

        if (!resetToken) {
            toast.error('Invalid reset link')
            navigate('/login')
            return
        }

        setToken(resetToken)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(`${backendURL}/api/user/reset-password`, {
                token,
                newPassword: password
            })

            if (response.data.success) {
                toast.success('Password reset successfully!')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password reset failed'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                        Reset Password
                    </h1>
                    <p className='text-gray-600'>
                        Enter your new password below
                    </p>
                </div>

                <div className='bg-white p-8 rounded-lg shadow-md'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='relative'>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                                New Password
                            </label>
                            <input
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                placeholder='Enter new password'
                                required
                                minLength={8}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-600'
                            >
                                {showPassword ? <img className='w-4' src='https://img.icons8.com/?size=100&id=85028&format=png&color=000000' /> : <img className='w-4' src='https://img.icons8.com/?size=100&id=85035&format=png&color=000000' />}
                            </button>
                        </div>

                        <div className='relative'>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                                Confirm New Password
                            </label>
                            <input
                                id='confirmPassword'
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                placeholder='Confirm new password'
                                required
                                minLength={8}
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-600'
                            >
                                {showConfirmPassword ? <img className='w-4' src='https://img.icons8.com/?size=100&id=85028&format=png&color=000000' /> : <img className='w-4' src='https://img.icons8.com/?size=100&id=85035&format=png&color=000000' />}
                            </button>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg font-medium ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                } transition-colors`}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                </div>

                <div className='text-center'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-blue-600 hover:text-blue-800 underline'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
