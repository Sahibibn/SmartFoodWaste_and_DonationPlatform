import React from "react";
import { Heart, Bell, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
          <Heart
            size={20}
            className="text-white"
            fill="white"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            SmartFood
          </h1>

          <p className="text-xs text-gray-400">
            Reduce Waste • Feed People
          </p>
        </div>
      </div>


      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Bell
            size={21}
            className="text-gray-600"
          />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>


        {/* User */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <User
              size={18}
              className="text-green-600"
            />
          </div>

          <span className="hidden sm:block text-sm font-medium text-gray-700">
            User
          </span>
        </button>

      </div>

    </nav>
  );
};

export default Navbar;