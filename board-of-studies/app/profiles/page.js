import { createClient } from "../utils/supabase/server";
import ProfileBox from "../components/ProfileBox";
import { signout } from "./actions";

const Profile = () => {
  return (
    <>
      <div className="w-[96vw] mx-auto h-[8vh] bg-white rounded-md shadow-md">
        <h1 className="font-bold text-xl py-4 px-6">Admin Profile Details</h1>

        <ProfileBox />
      </div>
    </>
  );
};

export default Profile;
