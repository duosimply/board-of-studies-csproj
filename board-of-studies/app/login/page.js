"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "./actions";

const Login = () => {
  const [passIsVisible, setPassIsVisible] = useState(false);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[url('/bluerose.jpg')] bg-cover bg-center">
      <div className="bg-white  w-[95%] h-[95%] rounded-[45px] grid grid-cols-2">
        <div className="flex flex-col justify-center items-center w-full bg-transparent font-bodoni_moda">
          <h1 className="text-4xl font-bold ">Welcome to Management</h1>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="my-6">
            <h2 className="text-4xl font-bold font-bodoni_moda">
              Welcome Back
            </h2>
            <p className="text-sm font-space_grotesk">
              Please enter your email and password to sign in
            </p>
          </div>
          <form className="space-y-4 w-3/6" action={login}>
            <div className="my-2 relative">
              <label htmlFor="username" className="font-space_grotesk text-sm">
                Email
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your email"
                className="rounded-xl font-space_grotesk p-2 px-4 my-2 w-full focus:outline-none bg-gray-100 placeholder:text-[13px] placeholder:text-gray-400"
              />
            </div>
            <div className="my-2 relative">
              <label htmlFor="password" className="font-space_grotesk text-sm">
                Password
              </label>
              <input
                type={passIsVisible ? `text` : `password`}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="rounded-xl font-space_grotesk p-2 px-4 my-2 w-full focus:outline-none bg-gray-100 placeholder:text-[13px] placeholder:text-gray-400"
              />
              <div
                className="absolute top-11 right-4 cursor-pointer"
                onClick={() => {
                  setPassIsVisible(!passIsVisible);
                }}
              >
                {passIsVisible ? (
                  <Image
                    src="/visibility_open.svg"
                    width={16}
                    height={16}
                    alt="password visibility open"
                  />
                ) : (
                  <Image
                    src="/visibility_close.svg"
                    width={16}
                    height={16}
                    alt="password visibility close"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row justify-end"></div>
            <button
              type="submit"
              className="bg-black w-full text-white px-4 py-[0.75rem] rounded-xl my-4 text-sm font-semibold font-space_grotesk"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
