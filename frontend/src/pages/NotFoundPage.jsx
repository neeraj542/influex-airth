import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-purple-800">404</h1>
      <p className="text-lg text-gray-700 mt-2">Oops! The page you're looking for doesn't exist.</p>
      
      <img
        src="https://i.imgur.com/qIufhof.png"
        alt="Not Found"
        className="w-80 mt-6"
      />

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-900 transition-all"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
