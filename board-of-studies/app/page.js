

export default function Home() {
  return (
    <div className="grid grid-cols-2 w-screen h-screen">
      {/* Left Column */}
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Management</h1>
      </div>

      {/* Right Column */}
      <div className="bg-gray-200 flex flex-col justify-center items-center w-full">
        <div className="my-6">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-sm">Please enter your details</p>
        </div>
        <form className="space-y-4 w-2/5">
          <div className="my-2 relative">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Email"
              className="border-[#A69999] border-b-2 p-2 my-2 w-full focus:outline-none bg-gray-300 placeholder:text-sm placeholder:text-black"
            />
            <label
              htmlFor="username"
              className=""></label>
          </div>
          <div className="my-2 relative">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="border-[#A69999] border-b-2 p-2 my-2 w-full focus:outline-none bg-gray-300 placeholder:text-sm placeholder:text-black"

            />
            <label
              htmlFor="password"
              className=""></label>
          </div>
          <button
            type="submit"
            className="bg-[#060606] w-full text-white px-4 py-[0.75rem] rounded my-4 text-sm font-semibold"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
