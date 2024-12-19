import { createClient } from "../utils/supabase/server";
import Profile from "./Profile";

const ProfileBox = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Error fetching profiles:", error.message);
    return <div>Error loading profiles</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4 bg-gray-50">
      {data.map((profile) => (
        <Profile key={profile.id} data={profile} />
      ))}
    </div>
  );
};

export default ProfileBox;
