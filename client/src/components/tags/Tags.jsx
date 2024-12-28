import React from "react";

const Tags = ({ tags }) => {
  return (
    <div>
      <div className="flex space-x-2 my-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;
