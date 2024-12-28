import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatUserList from '../../components/chat/ChatUserList';

const UserPersonalProfile = () => {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [activeTab, setActiveTab] = useState("post"); // Default tab is 'post'
  const { uid } = useParams();
  const [showChatUserList, setShowChatUserList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!uid) {
        console.error("postedBy is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}`
        );
        if (response.data.success) {
          setAuthor(response.data.rs);
          console.log(response.data.rs);
        } else {
          console.error("Failed to fetch author:", response.data);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
    fetchPosts(); // Default fetch posts on component mount
  }, [uid]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}/posts`
      );
      if (response.data.success) {
        setPosts(response.data.posts);
      } else {
        console.error("Failed to fetch posts:", response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}/questions`
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
      } else {
        console.error("Failed to fetch questions:", response.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}/followers`
      );
      if (response.data.success) {
        setFollowers(response.data.followers);
      } else {
        console.error("Failed to fetch followers:", response.data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}/followings`
      );
      if (response.data.success) {
        setFollowings(response.data.followings);
      } else {
        console.error("Failed to fetch followings:", response.data);
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };
  const submitFollowings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/following/${uid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        fetchFollowings();
        console.log(response.data);
      } else {
        console.error("Failed to fetch followings:", response.data);
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Fetch data based on selected tab
    if (tab === "post") {
      fetchPosts();
    } else if (tab === "question") {
      fetchQuestions();
    } else if (tab === "follower") {
      fetchFollowers();
    } else if (tab === "following") {
      fetchFollowings();
    }
  };
  const handleFollow = () => {
    submitFollowings();
  };
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleSelectUser = (selectedUser) => {
    setShowChatUserList(false);
    navigate(`/chat/${selectedUser._id}`);
  };

  const handleStartChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    // Kiểm tra để không chat với chính mình
    if (currentUser._id === author._id) {
      toast.warning('Không thể chat với chính mình');
      return;
    }
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/roomchat/${author._id}`,{
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log(response.data.rs)
          
    // Chuyển đến trang chat với người dùng được chọn
    navigate("/chat/");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }

  };

  return (
    <div className="min-h-screen bg-[#F2F7FB] pb-12">
      {/* Profile Header */}
      <div className="w-full max-w-6xl mx-auto pt-10">
        <div className="flex items-start gap-12 px-8">
          {/* Avatar Section */}
          <div className="relative">
            <img
              src={author?.avatar}
              alt=""
              className="w-[180px] h-[180px] object-cover border-4 border-[#839DD1] rounded-2xl shadow-lg"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 pt-4">
            <h1 className="font-wixmadefor font-bold text-4xl text-[#262C40] mb-4">
              {author?.firstname || "Undefined"}
            </h1>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <p className="font-wixmadefor text-lg">
                  <span className="text-[#839DD1] font-medium">Email: </span>
                  <span className="text-[#262C40]">{author?.email}</span>
                </p>
                <p className="font-wixmadefor text-lg">
                  <span className="text-[#839DD1] font-medium">Phone: </span>
                  <span className="text-[#262C40]">{author?.phone}</span>
                </p>
              </div>
              <div>
                <p className="font-wixmadefor text-lg">
                  <span className="text-[#839DD1] font-medium">Address: </span>
                  <span className="text-[#262C40]">{author?.address}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleFollow}
                className="px-8 h-12 bg-[#6374AE] rounded-xl font-wixmadefor font-semibold text-white text-lg hover:bg-[#5A6A9F] transition-colors"
              >
                Follow
              </button>
              <button 
                onClick={handleStartChat}
                className="w-12 h-12 bg-[#6374AE] rounded-xl font-wixmadefor text-white text-2xl hover:bg-[#5A6A9F] transition-colors"
              >
                <i className="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full bg-[#B9D3EE] mt-12 mb-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-center gap-12 py-6">
            {["post", "question", "follower", "following"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`font-wixmadefor font-bold text-2xl capitalize transition-colors ${
                  activeTab === tab
                    ? "text-[#6374AE]"
                    : "text-[#839DD1] hover:text-[#6374AE]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-8">
        {/* Posts Grid */}
        {activeTab === "post" && (
          <div className="grid grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border-2 border-[#9CB6DD] hover:shadow-lg transition-all"
              >
                <h2 className="font-wixmadefor font-bold text-2xl text-[#6374AE] mb-4">
                  {truncateText(post.title, 50)}
                </h2>
                <div
                  className="font-wixmadefor text-[#262C40] line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: truncateText(post.content, 150),
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Questions Grid */}
        {activeTab === "question" && (
          <div className="grid grid-cols-3 gap-6">
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border-2 border-[#9CB6DD] hover:shadow-lg transition-all"
              >
                <h2 className="font-wixmadefor font-bold text-2xl text-[#6374AE] mb-4">
                  {truncateText(question.title, 50)}
                </h2>
                <div
                  className="font-wixmadefor text-[#262C40] line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: truncateText(question.content, 150),
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Followers List */}
        {activeTab === "follower" && (
          <div className="space-y-4">
            {followers.map((follower, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border-2 border-[#9CB6DD] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={follower.avatar}
                    alt=""
                    className="w-16 h-16 rounded-xl border-2 border-[#9CB6DD] object-cover"
                  />
                  <div>
                    <h3 className="font-wixmadefor font-semibold text-xl text-[#6374AE]">
                      {follower.firstname}
                    </h3>
                    <p className="text-[#839DD1]">{follower.email}</p>
                    <p className="text-[#262C40]">{follower.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Following List */}
        {activeTab === "following" && (
          <div className="space-y-4">
            {followings.map((following, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border-2 border-[#9CB6DD] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={following.avatar}
                    alt=""
                    className="w-16 h-16 rounded-xl border-2 border-[#9CB6DD] object-cover"
                  />
                  <div>
                    <h3 className="font-wixmadefor font-semibold text-xl text-[#6374AE]">
                      {following.firstname}
                    </h3>
                    <p className="text-[#839DD1]">{following.email}</p>
                    <p className="text-[#262C40]">{following.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showChatUserList && (
        <ChatUserList
          onSelectUser={handleSelectUser}
          onClose={() => setShowChatUserList(false)}
        />
      )}
    </div>
  );
};

export default UserPersonalProfile;
