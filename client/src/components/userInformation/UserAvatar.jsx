import React from "react";

const UserAvatar = ({ src }) => {
  return (
    <div>
      <img
        src={src}
        className="rounded-full w-12 h-12 border-[3px] border-gray-400 shadow-md"
        alt="User Avatar"
      />
    </div>
  );
};

export default UserAvatar;
