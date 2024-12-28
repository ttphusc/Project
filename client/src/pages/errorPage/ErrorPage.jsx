import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col h-screen text-center items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">Oops!</h1>
      <p className="text-2xl text-gray-700 mt-4">Something went wrong.</p>
      <p className="text-lg text-gray-500 mt-2">
        We couldn't find the page you were looking for.
      </p>
      <Link>
        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
