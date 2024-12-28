import React from "react";

const UserAvatarLarge = ({ src }) => {
  return (
    <div>
      <img
        src={src}
        className="rounded-full w-24 h-24 border-[3px] 
         shadow-md"
        alt="User Avatar"
      />
    </div>
  );
};

export default UserAvatarLarge;
