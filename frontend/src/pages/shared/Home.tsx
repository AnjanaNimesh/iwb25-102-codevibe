import React from 'react'
import Navbar from './components/navbar'
import HeroSection from './components/HeroSection'
import UserTypesSection from './components/UserTypes'
import ServicesSection from './components/Services'
import WhyChooseSection from './components/WhyChooseSection'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <UserTypesSection/>
      <ServicesSection/>
      <WhyChooseSection/>
      <Footer/>
    </div>
  )
}

export default Home