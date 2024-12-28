import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import SideBarReturn from "../../layout/sidebar/SideBarReturn";
import SideBarRight from "../../layout/sidebar/SideBarRight";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import RecipeEditor from "../../components/editor/RecipeEditor";
import ExerciseEditor from "../../components/editor/ExcerciseEditor";

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }],
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "code-block"],
    ["blockquote", "code", "formula"],
    [{ script: "sub" }, { script: "super" }],
    ["clean"],
  ],
};

const PostEdit = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/post/${pid}/post`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          const postData = response.data.post;
          setPost(postData);
          setTitle(postData.title || "");
          setContent(postData.content || "");
          setTags(postData.tags ? postData.tags.join(", ") : "");

          if (postData.recipes && Array.isArray(postData.recipes)) {
            setRecipes(
              postData.recipes.filter((recipe) => recipe && recipe._id)
            );
          } else {
            setRecipes([]);
          }

          if (postData.excercises && Array.isArray(postData.excercises)) {
            setExercises(
              postData.excercises.filter((exercise) => exercise && exercise._id)
            );
          } else {
            setExercises([]);
          }
        }
      } catch (error) {
        toast.error("Không thể tải bài viết");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [pid]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const tagList = tags.split(",").map((tag) => tag.trim());

      if (tagList.length > 5) {
        toast.error("Only up to 5 tags are allowed");
        return;
      }

      const updateData = {
        title,
        content,
        tags: tagList,
        recipes: recipes.map((recipe) => recipe._id),
        exercises: exercises.map((exercise) => exercise._id),
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${pid}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Post updated successfully");
        navigate(`/post/${pid}`);
      }
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    }
  };

  const renderRecipes = () => {
    if (!Array.isArray(recipes) || recipes.length === 0) {
      return (
        <div className="mt-8">
          <p className="text-gray-500 font-wixmadefor">
            No recipes found for this post.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold text-[#262C40] font-wixmadefor mb-4">
          Recipes
        </h2>
        {recipes.map((recipe) =>
          recipe && recipe._id ? (
            <div
              key={recipe._id}
              className="bg-[#F2F7FB] rounded-xl p-4 border-2 border-[#9CB6DD]"
            >
              <RecipeEditor
                recipe={recipe}
                onUpdate={async (updatedRecipe) => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    const response = await axios.put(
                      `${import.meta.env.VITE_API_URL}/api/v1/recipe/${
                        recipe._id
                      }`,
                      updatedRecipe,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (response.data.success) {
                      const updatedRecipeData = response.data.rs;
                      setRecipes((prevRecipes) =>
                        prevRecipes.map((r) =>
                          r._id === recipe._id ? updatedRecipeData : r
                        )
                      );
                      toast.success("Recipe updated successfully");
                    }
                  } catch (error) {
                    toast.error("Failed to update recipe");
                    console.error(error);
                  }
                }}
                onDelete={async (recipeId) => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    await axios.delete(
                      `${
                        import.meta.env.VITE_API_URL
                      }/api/v1/recipe/${recipeId}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setRecipes(recipes.filter((r) => r._id !== recipeId));
                    toast.success("Recipe deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete recipe");
                  }
                }}
              />
            </div>
          ) : null
        )}
      </div>
    );
  };

  const renderExercises = () => {
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return (
        <div className="mt-8">
          <p className="text-gray-500 font-wixmadefor">
            No exercises found for this post.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold text-[#262C40] font-wixmadefor mb-4">
          Exercises
        </h2>
        {exercises.map((exercise) =>
          exercise && exercise._id ? (
            <div
              key={exercise._id}
              className="bg-[#F2F7FB] rounded-xl p-4 border-2 border-[#9CB6DD]"
            >
              <ExerciseEditor
                exercise={exercise}
                onUpdate={async (updatedExercise) => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    const response = await axios.put(
                      `${import.meta.env.VITE_API_URL}/api/v1/excercise/${
                        exercise._id
                      }`,
                      updatedExercise,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (response.data.success) {
                      const updatedExerciseData = response.data.rs;
                      setExercises((prevExercises) =>
                        prevExercises.map((ex) =>
                          ex._id === exercise._id ? updatedExerciseData : ex
                        )
                      );
                      toast.success("Exercise updated successfully");

                      console.log(
                        "Updated exercise data:",
                        updatedExerciseData
                      );
                      console.log("Current exercises state:", exercises);
                    }
                  } catch (error) {
                    toast.error("Failed to update exercise");
                    console.error(error);
                  }
                }}
                onDelete={async (exerciseId) => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    await axios.delete(
                      `${
                        import.meta.env.VITE_API_URL
                      }/api/v1/exercise/${exerciseId}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setExercises(exercises.filter((e) => e._id !== exerciseId));
                    toast.success("Exercise deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete exercise");
                  }
                }}
              />
            </div>
          ) : null
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log("Current exercises:", exercises);

  return (
    <div className="w-full min-h-screen bg-[#F2F7FB] flex">
      <div className="w-1/6">
        <SideBarReturn />
      </div>

      <div className="flex-1 py-8 px-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-[30px] border-[3px]  p-8 mb-6">
            <h1 className="text-3xl font-bold text-[#262C40] font-wixmadefor mb-2">
              Edit Post
            </h1>
            <p className="text-gray-500 font-wixmadefor">
              Update your post content, recipes, and exercises
            </p>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-[30px] border-[3px]  p-8 mb-6">
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-[#262C40] font-wixmadefor font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full border-2 border-[#9CB6DD] p-4 rounded-xl 
                         focus: focus:ring-2 focus:ring-[#6374AE]/20 
                         outline-none transition-all text-lg font-wixmadefor"
              />
            </div>

            {/* Tags Input */}
            <div className="mb-6">
              <label className="block text-[#262C40] font-wixmadefor font-semibold mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., fitness, health, nutrition)"
                className="w-full border-2 border-[#9CB6DD] p-4 rounded-xl 
                         focus: focus:ring-2 focus:ring-[#6374AE]/20 
                         outline-none transition-all font-wixmadefor"
              />
              <p className="mt-2 text-sm text-gray-500 font-wixmadefor">
                Maximum 5 tags allowed
              </p>
            </div>

            {/* Content Editor */}
            <div className="mb-8">
              <label className="block text-[#262C40] font-wixmadefor font-semibold mb-2">
                Content
              </label>
              <div className="border-2 border-[#9CB6DD] rounded-xl overflow-hidden">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  theme="snow"
                  className="h-[400px] font-wixmadefor"
                />
              </div>
            </div>
          </div>

          {/* Recipes Section */}
          <div className="bg-white rounded-[30px] border-[3px]  p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#262C40] font-wixmadefor">
                  Recipes
                </h2>
                <p className="text-gray-500 font-wixmadefor mt-1">
                  Manage recipes associated with this post
                </p>
              </div>
            </div>

            {recipes && recipes.length > 0 ? (
              <div className="space-y-6">
                {recipes.map(
                  (recipe) =>
                    recipe &&
                    recipe._id && (
                      <div
                        key={recipe._id}
                        className="bg-[#F8FAFD] rounded-2xl p-6 border-2 border-[#9CB6DD]
                               hover: transition-all duration-300"
                      >
                        <RecipeEditor
                          recipe={recipe}
                          onUpdate={async (updatedRecipe) => {
                            try {
                              const token = localStorage.getItem("accessToken");
                              const response = await axios.put(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/v1/recipe/${recipe._id}`,
                                updatedRecipe,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              if (response.data.success) {
                                const updatedRecipeData = response.data.rs;
                                setRecipes((prevRecipes) =>
                                  prevRecipes.map((r) =>
                                    r._id === recipe._id ? updatedRecipeData : r
                                  )
                                );
                                toast.success("Recipe updated successfully");
                              }
                            } catch (error) {
                              toast.error("Failed to update recipe");
                              console.error(error);
                            }
                          }}
                          onDelete={async (recipeId) => {
                            try {
                              const token = localStorage.getItem("accessToken");
                              await axios.delete(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/v1/recipe/${recipeId}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              setRecipes(
                                recipes.filter((r) => r._id !== recipeId)
                              );
                              toast.success("Recipe deleted successfully");
                            } catch (error) {
                              toast.error("Failed to delete recipe");
                            }
                          }}
                        />
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-wixmadefor">
                  No recipes found for this post
                </p>
              </div>
            )}
          </div>

          {/* Exercises Section */}
          <div className="bg-white rounded-[30px] border-[3px]  p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#262C40] font-wixmadefor">
                  Exercises
                </h2>
                <p className="text-gray-500 font-wixmadefor mt-1">
                  Manage exercises associated with this post
                </p>
              </div>
            </div>

            {exercises && exercises.length > 0 ? (
              <div className="space-y-6">
                {exercises.map(
                  (exercise) =>
                    exercise &&
                    exercise._id && (
                      <div
                        key={exercise._id}
                        className="bg-[#F8FAFD] rounded-2xl p-6 border-2 border-[#9CB6DD]
                               hover: transition-all duration-300"
                      >
                        <ExerciseEditor
                          exercise={exercise}
                          onUpdate={async (updatedExercise) => {
                            try {
                              const token = localStorage.getItem("accessToken");
                              const response = await axios.put(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/v1/excercise/${exercise._id}`,
                                updatedExercise,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              if (response.data.success) {
                                const updatedExerciseData = response.data.rs;
                                setExercises((prevExercises) =>
                                  prevExercises.map((ex) =>
                                    ex._id === exercise._id
                                      ? updatedExerciseData
                                      : ex
                                  )
                                );
                                toast.success("Exercise updated successfully");

                                console.log(
                                  "Updated exercise data:",
                                  updatedExerciseData
                                );
                                console.log(
                                  "Current exercises state:",
                                  exercises
                                );
                              }
                            } catch (error) {
                              toast.error("Failed to update exercise");
                              console.error(error);
                            }
                          }}
                          onDelete={async (exerciseId) => {
                            try {
                              const token = localStorage.getItem("accessToken");
                              await axios.delete(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/v1/exercise/${exerciseId}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              setExercises(
                                exercises.filter((e) => e._id !== exerciseId)
                              );
                              toast.success("Exercise deleted successfully");
                            } catch (error) {
                              toast.error("Failed to delete exercise");
                            }
                          }}
                        />
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-wixmadefor">
                  No exercises found for this post
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 text-[#6374AE] bg-white rounded-xl 
                       border-2  hover:bg-[#6374AE] hover:text-white 
                       transition-all duration-300 font-wixmadefor font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-4 text-white bg-[#6374AE] rounded-xl 
                       hover:bg-[#4A5A9E] transition-all duration-300 
                       font-wixmadefor font-semibold"
            >
              Update Post
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/6">
        <SideBarRight />
      </div>
    </div>
  );
};

export default PostEdit;
