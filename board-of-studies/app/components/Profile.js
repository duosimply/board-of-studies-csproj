const Profile = ({ data }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      {data.role === "super-admin" ? (
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-80 mb-6">
          {/* Profile Photo */}
          <img
            src={data.photo_url}
            alt={data.name}
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>

          {/* Role */}
          <p className="text-gray-600 text-md mt-1 capitalize">{data.role}</p>
        </div>
      ) : data.role === "admin" ? (
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-64 mb-6">
          {/* Profile Photo */}
          <img
            src={data.photo_url}
            alt={data.name}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />

          {/* Name */}
          <h2 className="text-xl font-semibold text-gray-800">{data.name}</h2>

          {/* Role */}
          <p className="text-gray-600 text-md mt-1 capitalize">{data.role}</p>
        </div>
      ) : null}
      {/* Viewers are not displayed */}
    </div>
  );
};

export default Profile;
