import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">

      <div className="text-center max-w-2xl">

        <h1 className="text-5xl font-bold text-gray-800">
          SmartFood
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Connecting surplus food with people and NGOs who need it.
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <Link
            to="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Donor Dashboard
          </Link>

          <Link
            to="/ngo-dashboard"
            className="border border-green-600 text-green-700 hover:bg-green-100 px-6 py-3 rounded-lg font-medium"
          >
            NGO Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Home;