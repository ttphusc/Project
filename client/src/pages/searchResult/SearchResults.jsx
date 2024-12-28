import React from "react";
import { useLocation, Link } from "react-router-dom";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import SearchIcon from '@mui/icons-material/Search';
import PostAddIcon from '@mui/icons-material/PostAdd';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { motion } from "framer-motion";

const SearchResults = () => {
  const location = useLocation();
  const item = location.state?.item;

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F2F7FB] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md"
        >
          <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h1>
          <p className="text-gray-600">Please try searching for something else.</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen bg-[#F2F7FB] flex flex-row justify-between"
    >
      <SideBarReturn />
      <div className="w-full p-8">
        <div className="w-[1250px] mx-auto">
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4 mb-8"
          >
            <SearchIcon className="w-8 h-8 text-[#6374AE]" />
            <h1 className="text-3xl font-bold text-gray-800">Search Result</h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            {item.type === "post" && (
              <Link to={`/post/postdetail/${item._id}`}>
                <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[#6374AE]">
                  <div className="flex items-center gap-3 mb-4">
                    <PostAddIcon className="w-6 h-6 text-[#6374AE]" />
                    <span className="text-sm font-medium text-[#6374AE] uppercase tracking-wider">Post</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#6374AE] transition-colors mb-4">
                    {item.title}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-600 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <VisibilityIcon className="w-4 h-4" />
                        <span>{item.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {item.type === "question" && (
              <Link to={`/question/questiondetail/${item._id}`}>
                <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-[#6374AE]">
                  <div className="flex items-center gap-3 mb-4">
                    <QuestionAnswerIcon className="w-6 h-6 text-[#6374AE]" />
                    <span className="text-sm font-medium text-[#6374AE] uppercase tracking-wider">Question</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#6374AE] transition-colors mb-4">
                    {item.title}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {item.tags && item.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#F2F7FB] text-[#6374AE] text-sm rounded-full flex items-center gap-1"
                        >
                          <LocalOfferIcon className="w-4 h-4" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <VisibilityIcon className="w-4 h-4" />
                        <span>{item.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {item.type === "event" && (
              <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-[#6374AE]">
                <div className="flex items-center gap-3 mb-4">
                  <EventIcon className="w-6 h-6 text-[#6374AE]" />
                  <span className="text-sm font-medium text-[#6374AE] uppercase tracking-wider">Event</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-500">Start Time</p>
                      <p className="font-medium text-gray-700">
                        {new Date(item.timeStart).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500">End Time</p>
                      <p className="font-medium text-gray-700">
                        {new Date(item.timeEnd).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <SideBarRight />
    </motion.div>
  );
};

export default SearchResults;
