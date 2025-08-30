import React, { useState } from 'react'
import { backendURL } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendURL + '/api/user/admin', { email, password });
            // console.log(response);

            if (response.data.success) {
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Admin Panel</h1>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <p className='mb-1 font-semibold'>Email</p>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400'
                            placeholder='Admin Email'
                            required
                        />
                    </div>
                    <div>
                        <p className='mb-1 font-semibold'>Password</p>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full border border-gray-300 px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-amber-400'
                                placeholder='Enter your password'
                                required
                            />
                            <button
                                type='button'
                                onClick={togglePasswordVisibility}
                                className='absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-gray-800'
                            >
                                {showPassword ? (
                                    <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M14.828 14.828L16.243 16.243' />
                                    </svg>
                                ) : (
                                    <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition-colors font-bold'
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
