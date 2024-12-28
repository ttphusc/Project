import React from "react";

const PostItemSmall = () => {
  return (
    <div className="w-3/5 h-[220px] bg-[#F2F7FB] rounded-[30px] border-[3px] border-[#6374AE]">
      <div className="flex flex-row items-center p-5 justify-between">
        <div className="justify-start flex">
          <img
            src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
            alt=""
            className="w-[60px] h-[60px] border-[3px] border-[#9CB6DD] rounded-[10px]"
          />
          <div className="flex flex-col px-4 ">
            <h1 className="text-[#6374AE] font-wixmadefor font-semibold text-xl">
              Marvin McKinney
            </h1>
            <p className="text-[#839DD1] font-wixmadefor">about 4 hours ago</p>
          </div>
        </div>
        <div className=" flex flex-row space-x-4">
          <div className="items-center justify-center w-16 h-9 p-2 bg-[#6374AE] text-[#FAF8F6] font-wixmadefor rounded-[5px]">
            Asia
          </div>
          <div className="items-center justify-center w-24 h-9 p-2 bg-[#6374AE] text-[#FAF8F6] font-wixmadefor rounded-[5px]">
            Cooking
          </div>
        </div>
      </div>

      <h1 className="text-3xl text-[#262C40] font-bold px-5 w-[1000px]">
        Wholesome Eats: Nutritious Recipes to Keep You Energized and...
      </h1>
      <div className="flex flex-row p-5 ">
        <svg
          width="26"
          height="24"
          viewBox="0 0 26 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.3756 12.715L13.0006 22L3.62562 12.715C3.00725 12.1132 2.52017 11.39 2.19506 10.5908C1.86994 9.79155 1.71382 8.93367 1.73654 8.07114C1.75926 7.20862 1.96032 6.36015 2.32707 5.57915C2.69381 4.79815 3.21829 4.10154 3.86748 3.5332C4.51667 2.96486 5.2765 2.53709 6.09913 2.27683C6.92177 2.01657 7.78938 1.92946 8.64733 2.02098C9.50528 2.1125 10.335 2.38067 11.0842 2.80861C11.8334 3.23655 12.4859 3.81498 13.0006 4.50748C13.5175 3.82 14.1708 3.24663 14.9195 2.82323C15.6682 2.39984 16.4962 2.13554 17.3518 2.04688C18.2073 1.95822 19.072 2.0471 19.8916 2.30797C20.7112 2.56883 21.4682 2.99607 22.1151 3.56293C22.762 4.12979 23.2849 4.82408 23.6511 5.60234C24.0174 6.3806 24.219 7.22608 24.2435 8.08586C24.268 8.94564 24.1147 9.80122 23.7933 10.599C23.4719 11.3969 22.9893 12.1198 22.3756 12.7225"
            stroke="#262C40"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1 className="px-3 pr-10 font-wixmadefor font-semibold">12.3K</h1>
        <svg
          width="26"
          height="25"
          viewBox="0 0 26 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 8.25H18M8 13.25H15.5M20.5 2C21.4946 2 22.4484 2.39509 23.1517 3.09835C23.8549 3.80161 24.25 4.75544 24.25 5.75V15.75C24.25 16.7446 23.8549 17.6984 23.1517 18.4017C22.4484 19.1049 21.4946 19.5 20.5 19.5H14.25L8 23.25V19.5H5.5C4.50544 19.5 3.55161 19.1049 2.84835 18.4017C2.14509 17.6984 1.75 16.7446 1.75 15.75V5.75C1.75 4.75544 2.14509 3.80161 2.84835 3.09835C3.55161 2.39509 4.50544 2 5.5 2H20.5Z"
            stroke="#262C40"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1 className="px-3 font-wixmadefor font-semibold">374</h1>
      </div>
    </div>
  );
};

export default PostItemSmall;
