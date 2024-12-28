import React from "react";
import { Link } from "react-router-dom";

const NavBarEvent = () => {
  return (
    <div className="w-full h-[110px] bg-gradient-to-r from-[#EEF2FF] via-[#F2F7FB] to-[#EEF2FF] flex flex-row items-center justify-around rounded-[30px] border-[3px] border-[#6374AE]/30 shadow-[0_10px_20px_rgba(99,116,174,0.2)] backdrop-blur-sm hover:shadow-[0_15px_30px_rgba(99,116,174,0.3)] transition-all duration-500">
      <div className="flex flex-col relative group">
        <h1 className="font-semibold font-wixmadefor text-2xl bg-gradient-to-r from-[#262C40] to-[#6374AE] bg-clip-text text-transparent mb-2 group-hover:scale-[1.02] transition-all duration-300">
          Plan an Event, Create Memories
        </h1>
        <p className="text-[#839DD1] font-wixmadefor text-lg group-hover:text-[#6374AE] transition-all duration-300">
          Bring people together and make moments unforgettable.
        </p>
      </div>

      <Link to="/event/create">
        <button className="relative w-[200px] h-[60px] bg-gradient-to-r from-[#6374AE] to-[#7A8CC7] rounded-[15px] flex items-center justify-around overflow-hidden group hover:shadow-[0_5px_15px_rgba(99,116,174,0.5)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7A8CC7] to-[#6374AE] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <svg
            width="35"
            height="35"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 group-hover:rotate-90 transition-transform duration-500"
          >
            <path
              d="M11.25 15H18.75M15 11.25V18.75M3.75 15C3.75 16.4774 4.04099 17.9403 4.60636 19.3052C5.17172 20.6701 6.00039 21.9103 7.04505 22.955C8.08971 23.9996 9.3299 24.8283 10.6948 25.3936C12.0597 25.959 13.5226 26.25 15 26.25C16.4774 26.25 17.9403 25.959 19.3052 25.3936C20.6701 24.8283 21.9103 23.9996 22.955 22.955C23.9996 21.9103 24.8283 20.6701 25.3936 19.3052C25.959 17.9403 26.25 16.4774 26.25 15C26.25 12.0163 25.0647 9.15483 22.955 7.04505C20.8452 4.93526 17.9837 3.75 15 3.75C12.0163 3.75 9.15483 4.93526 7.04505 7.04505C4.93526 9.15483 3.75 12.0163 3.75 15Z"
              stroke="#F2F7FB"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="font-wixmadefor text-[#F2F7FB] text-2xl font-semibold relative z-10 group-hover:scale-110 transition-transform duration-300">
            Create
          </h1>
        </button>
      </Link>
    </div>
  );
};

export default NavBarEvent;
