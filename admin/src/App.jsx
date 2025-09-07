import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
import Quotes from './pages/Quotes.jsx'
import Login from './components/Login.jsx'
import { ToastContainer } from 'react-toastify';

export const backendURL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className='flex w-full border-t border-t-gray-300'>
            <Sidebar />
            <div className='flex-1 p-4 overflow-auto'>
              <Routes>
                <Route path='/add' element={<Add setToken={setToken} />} />
                <Route path='/list' element={<List setToken={setToken} />} />
                <Route path='/orders' element={<Orders setToken={setToken} />} />
                <Route path='/quotes' element={<Quotes setToken={setToken} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default App
