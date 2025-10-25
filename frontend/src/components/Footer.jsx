import React from 'react'
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_] gap-14 my-10 mt-40 text-sm'>
        <div>
          {/* left */}
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'> This is just description not prescreption</p>
        </div>
        <div>
          {/* center */}
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          {/* right*/}
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col text-gray-600'>
            <li>+1234567890</li>
            <li>abc123@gmail.com</li>
          </ul>
        </div>
      </div>
        {/* copyright */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>© 2025. All rights reserved.</p>
      </div>


    </div>
  )
}

export default Footer;