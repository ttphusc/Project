import React from "react";

const AiRecommendationItem = () => {
  return (
    <div>
      <div>
        <div className="w-3/5 h-[800px] bg-[#F2F7FB] border-[3px] border-[#64748b] rounded-[30px]">
          <h1 className="p-5 font-wixmadefor font-semibold text-3xl">
            AI Recommendation!
          </h1>
          <p className="pb-5 px-5 font-wixmadefor font-semibold text-[#94a3b8]">
            AI has provided you with a customized workout and meal plan based on
            your current health condition and the recent activities you liked.
            Be sure to follow it today for the best results!
          </p>
          <h1 className="pb-5 px-5 font-wixmadefor text-2xl font-bold text-[#64748b]">
            Recipe
          </h1>
          <div className="px-5">
            <div className="w-full h-[200px] border-[3px] border-[#64748b] rounded-[30px]">
              <div className="flex justify-between p-5">
                <div className="flex flex-row items-center">
                  <img
                    src="https://st.quantrimang.com/photos/image/2021/02/04/Hinh-nen-Quoc-Ky-VN-6.jpg"
                    alt=""
                    className="w-[70px] h-[70px] border-[3px] border-[#64748b] rounded-2xl"
                  />

                  <div className="flex flex-col px-5">
                    <h2 className="font-wixmadefor text-2xl font-bold text-[#64748b]">
                      Jacob Jones
                    </h2>
                    <p className="font-wixmadefor text-base font-medium text-[#64748b]">
                      about 4 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pl-5 ">
                  <div className="px-2">
                    <div className="w-24 h-9 border-[3px] border-[#64748b] bg-[#64748b] rounded-[5px] flex justify-center font-wixmadefor  text-[#fafaf9]">
                      Asia
                    </div>
                  </div>
                  <div className="pr-10">
                    <div className="w-24 h-9 border-[3px] border-[#64748b] bg-[#64748b] rounded-[5px] flex justify-center font-wixmadefor  text-[#fafaf9]">
                      Cooking
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="px-5 font-wixmadefor text-2xl font-bold text-[#1e293b]">
                Wholesome Eats: Nutritious Recipes to Keep You Energized and...
              </h1>
            </div>
          </div>
          <div className="pt-10">
            <h1 className="pb-5 px-5 font-wixmadefor text-2xl font-bold text-[#64748b]">
              Exercise
            </h1>
            <div className="px-5">
              <div className="w-full h-[200px] border-[3px] border-[#64748b] rounded-[30px]">
                <div className="flex justify-between p-5">
                  <div className="flex flex-row items-center">
                    <img
                      src="https://st.quantrimang.com/photos/image/2021/02/04/Hinh-nen-Quoc-Ky-VN-6.jpg"
                      alt=""
                      className="w-[70px] h-[70px] border-[3px] border-[#64748b] rounded-2xl"
                    />

                    <div className="flex flex-col px-5">
                      <h2 className="font-wixmadefor text-2xl font-bold text-[#64748b]">
                        Jacob Jones
                      </h2>
                      <p className="font-wixmadefor text-base font-medium text-[#64748b]">
                        about 4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pl-5 ">
                    <div className="px-2">
                      <div className="w-24 h-9 border-[3px] border-[#64748b] bg-[#64748b] rounded-[5px] flex justify-center font-wixmadefor  text-[#fafaf9]">
                        Asia
                      </div>
                    </div>
                    <div className="pr-10">
                      <div className="w-24 h-9 border-[3px] border-[#64748b] bg-[#64748b] rounded-[5px] flex justify-center font-wixmadefor  text-[#fafaf9]">
                        Cooking
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="px-5 font-wixmadefor text-2xl font-bold text-[#1e293b]">
                  Wholesome Eats: Nutritious Recipes to Keep You Energized
                  and...
                </h1>
              </div>
            </div>
            <div className="p-5 flex justify-end">
              <h1 className="w-60 h-16 bg-[#64748b] border-[3px] border-[#64748b] rounded-[10px] text-2xl text-[#f1f5f9] font-bold font-wixmadefor flex justify-center items-center">
                AI Recommend
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiRecommendationItem;
