'use client'

import { useState } from 'react'
import Image from 'next/image'
import { login } from './actions'

const Login = () => {
  const [passIsVisible, setPassIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    await login(formData)

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[url('/bluerose.jpg')] bg-cover bg-center">
      <div className='bg-white  w-[95%] h-[95%] rounded-[45px] grid grid-cols-2'>
        <div className='flex flex-col justify-center items-center w-full bg-transparent font-bodoni_moda'>
          <h1 className='text-4xl font-bold '>Welcome to Management</h1>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <div className='my-6'>
            <h2 className='text-4xl font-bold font-bodoni_moda'>
              Welcome Back
            </h2>
            <p className='text-sm font-space_grotesk'>
              Please enter your email and password to sign in
            </p>
          </div>
          <form
            className='space-y-4 w-3/6'
            onSubmit={handleLogin}
          >
            <div className='my-2 relative'>
              <label
                htmlFor='username'
                className='font-space_grotesk text-sm'
              >
                Email
              </label>
              <input
                required
                type='text'
                name='username'
                id='username'
                placeholder='Enter your email'
                className='rounded-xl font-space_grotesk p-2 px-4 my-2 w-full focus:outline-none bg-gray-100 placeholder:text-[13px] placeholder:text-gray-400'
              />
            </div>
            <div className='my-2 relative'>
              <label
                htmlFor='password'
                className='font-space_grotesk text-sm'
              >
                Password
              </label>
              <input
                required
                type={passIsVisible ? `text` : `password`}
                name='password'
                id='password'
                placeholder='Enter your password'
                className='rounded-xl font-space_grotesk p-2 px-4 my-2 w-full focus:outline-none bg-gray-100 placeholder:text-[13px] placeholder:text-gray-400'
              />
              <div
                className='absolute top-11 right-4 cursor-pointer'
                onClick={() => {
                  setPassIsVisible(!passIsVisible)
                }}
              >
                {passIsVisible ? (
                  <Image
                    src='/visibility_open.svg'
                    width={16}
                    height={16}
                    alt='password visibility open'
                  />
                ) : (
                  <Image
                    src='/visibility_close.svg'
                    width={16}
                    height={16}
                    alt='password visibility close'
                  />
                )}
              </div>
            </div>
            {/* <div className="flex flex-row justify-end">
              <div className="font-space_grotesk text-xs hover:underline cursor-pointer">
                Forgot Password?
              </div>
            </div> */}
            <button
              type='submit'
              className='bg-black w-full text-white px-4 py-[0.75rem] rounded-xl my-4 text-sm font-semibold font-space_grotesk'
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    class='text-gray-300 animate-spin'
                    viewBox='0 0 64 64'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                  >
                    <path
                      d='M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z'
                      stroke='currentColor'
                      strokeWidth='5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    ></path>
                    <path
                      d='M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762'
                      stroke='currentColor'
                      strokeWidth='5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-gray-900'
                    ></path>
                  </svg>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
