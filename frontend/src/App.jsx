import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import About from './pages/About'
import Custom from './pages/Custom'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import AuthSuccess from './pages/AuthSuccess'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Product from './pages/Product'
import TAC from './pages/TAC'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Returns from './pages/Returns'
import Shipping from './pages/Shipping'
import Cancellation from './pages/Cancellation'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalogue' element={<Catalogue />} />
        <Route path='/about' element={<About />} />
        <Route path='/tac' element={<TAC />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/returns' element={<Returns />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/cancellation' element={<Cancellation />} />
        <Route path='/custom' element={<Custom />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/auth/success' element={<AuthSuccess />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
