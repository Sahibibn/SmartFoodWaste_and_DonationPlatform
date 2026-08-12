import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center">

        <h1 className="text-7xl font-bold text-gray-800">
          404
        </h1>

        <p className="text-xl text-gray-500 mt-3">
          Page not found
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </Link>

      </div>

    </div>
  );
};

export default NotFound;