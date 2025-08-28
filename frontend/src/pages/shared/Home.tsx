import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import UserTypesSection from './components/UserTypes'
import ServicesSection from './components/Services'
import WhyChooseSection from './components/WhyChooseSection'
import Footer from './components/Footer'

const Home = () => {
  return (
    <div>
      
      <HeroSection/>
      <UserTypesSection/>
      <ServicesSection/>
      <WhyChooseSection/>
    
    </div>
  )
}

export default Home