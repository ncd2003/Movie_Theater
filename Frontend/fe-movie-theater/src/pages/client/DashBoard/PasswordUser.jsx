import React, { useState } from 'react';
import Header from '../../../layouts/Header/Header';
import Footer from '../../../layouts/Footer/Footer'
import { Link } from 'react-router-dom';
import LeftSideBarUser from './LeftSideBarUser';

function PassWordUser() {


  return (

    <>
      <Header />
      {/* Viền dưới Header */}

      <div className='bg-[#FDFCF0] '>
        <div className='relative mb-5'>
          <div className='absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]'></div>
        </div>

        <div className='flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]'>
          {/* Left */}
          <LeftSideBarUser />


          {/* Right */}
          <div className='flex-[4] mt-5 ml-[-50px]'>
            <p className='text-xl text-white bg-slate-900 text-center py-[2px]'>
              CHANGE PASSWORD
            </p>

            {/* Form */}
            <form className='bg-white p-6 rounded-lg shadow-md mt-6 w-2/3 mx-auto'>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Current Password</label>
                <input
                  type='password'
                  className='w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none'
                  required
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>New Password</label>
                <input
                  type='password'
                  className='w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none'
                  required
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Confirm New Password</label>
                <input
                  type='password'
                  className='w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 mt-4'
              >
                Change Password
              </button>
            </form>


          </div>
        </div>
      </div>

      <Footer />

    </>

  )
}

export default PassWordUser
