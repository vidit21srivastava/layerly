import React from 'react'
import NewLaunch from '../components/NewLaunch'
import Hero from '../components/Hero'
import Bestseller from '../components/Bestseller'
import Pagestats from '../components/Pagestats'
import Policy from '../components/Policy'


const Home = () => {
    return (
        <div className=''>
            <Hero />
            <NewLaunch />
            <Bestseller />
            <Pagestats />
            <Policy />
        </div>
    )
}

export default Home
