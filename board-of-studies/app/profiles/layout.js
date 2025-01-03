import Link from "next/link";

export default function ProfileLayout({ children }) {
  return (
    <div className="font-space_grotesk">
      <nav className="flex flex-row justify-between w-full h-[60px] drop-shadow-md items-center px-4 bg-white">
        <div>Management</div>
        <div>User</div>
      </nav>
      <div className="flex flex-row ml-12 my-6 justify-between w-[34vw]">
        <Link href={'/dashboard'} className="px-12  py-2 rounded-s-md  w-1/2 border-[#bac5d5] border-[1px] cursor-pointer text-center transition-all hover:bg-[#8fa7b4] active:bg-[#709eb7]">
          Dashboard
        </Link>
        <div className="bg-[#A5C1D0] px-12 py-2 rounded-e-md w-1/2 cursor-pointer text-center">
          Profiles
        </div>
      </div>
      {children}
    </div>
  );
}
