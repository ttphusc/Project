import React from "react";

const UserInfomation = ({ name, timecreate }) => {
  return (
    <div className="">
      {/* User Information */}
      <div className="flex items-center space-x-2">
        <h3 className="text-green-600 text-sm font-semibold">{name}</h3>
        <p className="text-gray-500 text-sm">{timecreate}</p>
      </div>
    </div>
  );
};

export default UserInfomation;
