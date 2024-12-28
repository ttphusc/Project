import React, { useContext, useState } from "react";
import UserAvatarLarge from "../../components/userInformation/UserAvatarLarge";
import { AuthContext } from "../../context/AuthContext";

const UserManager = () => {
  const { user } = useContext(AuthContext);
  const [follower, setFollower] = useState(1);
  const [following, setFollowing] = useState(1);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div>
      <Header />

      <div className="flex flex-col w-full h-screen">
        <div className="w-full h-auto pt-24 bg-slate-200 flex flex-row">
          <div className=" items-center justify-evenly flex pl-16">
            <div className="items-center flex">
              <UserAvatarLarge src={user.avatar || "null"} />
              <div className="p-10">
                <h1 className="text-lg font-semibold">{user.firstname}</h1>
                <h1 className="text-lg font-semibold">{user.lastname}</h1>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 h-[4rem] px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
        <div className="w-full h-screen bg-slate-100 flex-row flex">
          <div className="w-3/4 h-auto bg-slate-300 flex flex-row justify-evenly blur-0">
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400 ">
              <h1 className="text-gray-500 text-lg font-semibold">Post</h1>
            </div>
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400">
              <h1 className="text-gray-500 text-lg font-semibold">Question</h1>
            </div>
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400">
              <h1 className="text-gray-500 text-lg font-semibold">
                Favorite Post
              </h1>
            </div>
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400">
              <h1 className="text-gray-500 text-lg font-semibold">
                Favorite Question
              </h1>
            </div>
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400">
              <h1 className="text-gray-500 text-lg font-semibold">Following</h1>
            </div>
            <div className="items-center justify-center flex w-full h-16 bg-slate-200 border border-gray-400">
              <h1 className="text-gray-500 text-lg font-semibold">Follower</h1>
            </div>
          </div>
          <div className="w-1/4 h-auto bg-slate-500 flex flex-col border border-gray-400">
            <h1></h1>
            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Following
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>
            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Following
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>
            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Follower
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>
            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Posts
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>

            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Question
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>

            <div className="w-full h-16 flex flex-row justify-between bg-slate-300 items-center">
              <h1 className="text-lg font-semibold px-6 text-gray-700">
                Favorites
              </h1>
              <h2 className="text-lg font-semibold px-6 text-gray-700">
                {following}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
