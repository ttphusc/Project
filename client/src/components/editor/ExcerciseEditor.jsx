import React, { useState } from "react";

const ExerciseEditor = ({ exercise, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);

  // Nếu không trong chế độ chỉnh sửa, hiển thị dạng xem
  if (!isEditing) {
    return (
      <div className="border p-4 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{exercise.name || "Untitled Exercise"}</h3>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(exercise._id)}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><span className="font-medium">Level:</span> {exercise.level}</p>
            <p><span className="font-medium">Force:</span> {exercise.force}</p>
            <p><span className="font-medium">Category:</span> {exercise.category}</p>
            <p><span className="font-medium">Mechanic:</span> {exercise.mechanic}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Primary Muscles:</span> {exercise.primaryMuscles?.join(", ")}</p>
            <p><span className="font-medium">Secondary Muscles:</span> {exercise.secondaryMuscles?.join(", ")}</p>
          </div>
        </div>

        {exercise.instructions && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <p className="text-gray-700 whitespace-pre-line">{exercise.instructions}</p>
          </div>
        )}
      </div>
    );
  }

  // Form chỉnh sửa
  return (
    <div className="border p-4 rounded-lg mb-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-4">Edit Exercise</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="name"
            value={exerciseData.name || ""}
            onChange={(e) => setExerciseData({...exerciseData, name: e.target.value})}
            placeholder="Exercise Name"
            className="w-full border p-2 rounded mb-4"
          />

          <select
            name="level"
            value={exerciseData.level || ""}
            onChange={(e) => setExerciseData({...exerciseData, level: e.target.value})}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            name="force"
            value={exerciseData.force || ""}
            onChange={(e) => setExerciseData({...exerciseData, force: e.target.value})}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Force</option>
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="hold">Hold</option>
          </select>

          <select
            name="category"
            value={exerciseData.category || ""}
            onChange={(e) => setExerciseData({...exerciseData, category: e.target.value})}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Category</option>
            <option value="stretching">Stretching</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="balance">Balance</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            name="mechanic"
            value={exerciseData.mechanic || ""}
            onChange={(e) => setExerciseData({...exerciseData, mechanic: e.target.value})}
            placeholder="Mechanic"
            className="w-full border p-2 rounded mb-4"
          />

          <input
            type="text"
            name="primaryMuscles"
            value={exerciseData.primaryMuscles?.join(", ") || ""}
            onChange={(e) => setExerciseData({
              ...exerciseData,
              primaryMuscles: e.target.value.split(",").map(m => m.trim())
            })}
            placeholder="Primary Muscles (comma separated)"
            className="w-full border p-2 rounded mb-4"
          />

          <input
            type="text"
            name="secondaryMuscles"
            value={exerciseData.secondaryMuscles?.join(", ") || ""}
            onChange={(e) => setExerciseData({
              ...exerciseData,
              secondaryMuscles: e.target.value.split(",").map(m => m.trim())
            })}
            placeholder="Secondary Muscles (comma separated)"
            className="w-full border p-2 rounded mb-4"
          />
        </div>
      </div>

      <textarea
        name="instructions"
        value={exerciseData.instructions || ""}
        onChange={(e) => setExerciseData({...exerciseData, instructions: e.target.value})}
        placeholder="Exercise Instructions"
        className="w-full border p-2 rounded h-32 mb-4"
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onUpdate(exerciseData);
            setIsEditing(false);
          }}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ExerciseEditor;
