import React, { useState, useEffect } from "react";
import LikeAndDislikePost from "../../features/favorite/LikeAndDislikePost";
import CommentInputPost from "../../features/comment/CommentInputPost";
import CommentItemNew from "../../features/comment/CommentItemNew";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";

const PostItemDetail = ({ post }) => {
  const [recipe, setRecipe] = useState(null);
  const [excercise, setExcercise] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const [showExcercise, setShowExcercise] = useState(false);

  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
      window.scrollTo(0, 0);
    }
  }, [post]);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (post?.idAuthor) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user/${post.idAuthor}`
          );
          if (response.data.success) {
            setAuthor(response.data.rs);
          } else {
            console.error("Failed to fetch author:", response.data);
          }
        } catch (error) {
          console.error("Error fetching author:", error);
        }
      } else {
        console.error("post.idAuthor is undefined or null");
      }
    };

    if (post) {
      fetchAuthor();
    }
  }, [post]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (post?.recipes && post.recipes.length > 0) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/recipe/${post.recipes[0]}`
          );
          if (response.data.success) {
            setRecipe(response.data.response);
            console.log("recipes::", response.data.response);
            setShowRecipe(true);
          } else {
            console.error("Failed to fetch recipe:", response.data);
          }
        } catch (error) {
          console.error("Error fetching recipe:", error);
        }
      } else {
        console.error("post.recipes is undefined or empty");
      }
    };

    if (post) {
      fetchRecipe();
    }
  }, [post]);

  useEffect(() => {
    const fetchExcercise = async () => {
      if (post?.excercises && post.excercises.length > 0) {
        try {
          console.log("post.excercises[0]::", post.excercises[0]);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/excercise/${
              post.excercises[0]
            }`
          );
          if (response.data.success) {
            setExcercise(response.data.excercise);
            console.log("excercise::", response.data.excercise);
            setShowExcercise(true);
          } else {
            console.error("Failed to fetch excercise:", response.data);
          }
        } catch (error) {
          console.error("Error fetching excercise:", error);
        }
      } else {
        console.error("post.excercise is undefined or empty");
      }
    };

    if (post) {
      console.log("post::", post);
      fetchExcercise();
    }
  }, [post]);

  const addComment = (newComments) => {
    setComments(newComments);
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6374AE]"></div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8 w-full">
      {/* Author Section */}
      <div className="flex items-center justify-between mb-8">
        <Link to={`/user/personalprofile/${author?._id}`}>
          <div className="flex items-center group hover:bg-gray-50 p-3 rounded-xl transition-all">
            <img
              src={
                author?.avatar ||
                "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
              }
              alt=""
              className="w-16 h-16 rounded-full border-2 border-[#6374AE] object-cover transition-transform group-hover:scale-105"
            />
            <div className="ml-4">
              <h1 className="text-[#6374AE] font-semibold text-xl group-hover:text-[#839DD1] transition-colors">
                {author?.firstname || "Unknown Author"}
              </h1>
              <p className="text-gray-500 text-sm">
                {post.createdAt
                  ? formatTimeCreate(post.createdAt)
                  : "about ? hours ago"}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-[#6374AE] text-white text-sm font-medium rounded-lg"
            >
              {tag || "none"}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <h1 className="text-3xl font-bold text-[#262C40] mb-6 w-full">
          {post.title ||
            "Wholesome Eats: Nutritious Recipes to Keep You Energized and Healthy?"}
        </h1>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        {post.image && (
          <div className="mb-6">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            />
          </div>
        )}
      </div>

      {/* Recipe Section */}
      {showRecipe && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#262C40] mb-6">Recipe</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                {recipe.name}
              </h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cooking time: {recipe.cooktime} hrs
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Calories: {recipe.calories !== null ? recipe.calories : "NaN"}{" "}
                  calories
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                Ingredients
              </h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: recipe.ingredients }} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                Instructions
              </h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Section */}
      {showExcercise && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#262C40] mb-6">Exercise</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                {excercise.name}
              </h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Primary Muscles: {excercise.primaryMuscles}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Secondary Muscles: {excercise.secondaryMuscles || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                Equipment
              </h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: excercise.equipment }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#262C40] mb-4">
                Instructions
              </h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: excercise.instructions }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Section */}
      <div className="space-y-6">
        <LikeAndDislikePost post={post} />
        <CommentInputPost post={post} addComment={addComment} />

        <div className="space-y-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItemNew key={comment._id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItemDetail;
