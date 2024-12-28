import React, { useState } from "react";

const RecipeEditor = ({ recipe, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [recipeData, setRecipeData] = useState({
    ...recipe,
    ingredients: recipe?.ingredients || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (e, index) => {
    const newIngredients = [...(recipeData.ingredients || [])];
    newIngredients[index] = e.target.value;
    setRecipeData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ""],
    }));
  };

  const removeIngredient = (index) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onUpdate(recipeData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="border p-4 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {recipeData.name || "Untitled Recipe"}
          </h3>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(recipeData._id)}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Prep Time:</span>{" "}
              {recipeData.preptime || 0} minutes
            </p>
            <p>
              <span className="font-medium">Cook Time:</span>{" "}
              {recipeData.cooktime || 0} minutes
            </p>
            <p>
              <span className="font-medium">Servings:</span>{" "}
              {recipeData.servings || 0} portions
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Calories:</span>{" "}
              {recipeData.calories || 0}
            </p>
            <p>
              <span className="font-medium">Protein:</span>{" "}
              {recipeData.protein || 0}g
            </p>
            <p>
              <span className="font-medium">Carbs:</span>{" "}
              {recipeData.carbs || 0}g
            </p>
          </div>
        </div>

        {recipeData.ingredients?.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Ingredients:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {recipeData.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {recipeData.instructions && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {recipeData.instructions}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg mb-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-4">Edit Recipe</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={recipeData.name || ""}
          onChange={handleChange}
          placeholder="Tên món ăn"
          className="border p-2 rounded"
        />
        <input
          name="preptime"
          type="number"
          value={recipeData.preptime || 0}
          onChange={handleChange}
          placeholder="Thời gian chuẩn bị (phút)"
          className="border p-2 rounded"
        />
        <input
          name="cooktime"
          type="number"
          value={recipeData.cooktime || 0}
          onChange={handleChange}
          placeholder="Thời gian nấu (phút)"
          className="border p-2 rounded"
        />
        <input
          name="servings"
          type="number"
          value={recipeData.servings || 0}
          onChange={handleChange}
          placeholder="Khẩu phần"
          className="border p-2 rounded"
        />
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Ingredient</h4>
        {(recipeData.ingredients || []).map((ingredient, index) => (
          <div key={index} className="flex mb-2">
            <input
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
              className="flex-1 border p-2 rounded mr-2"
            />
            <button
              onClick={() => removeIngredient(index)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
        <button onClick={addIngredient} className="text-blue-500">
          + Add ingredient
        </button>
      </div>

      <textarea
        name="instructions"
        value={recipeData.instructions || ""}
        onChange={handleChange}
        placeholder="Hướng dẫn nấu ăn"
        className="w-full mt-4 border p-2 rounded h-32"
      />

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RecipeEditor;
