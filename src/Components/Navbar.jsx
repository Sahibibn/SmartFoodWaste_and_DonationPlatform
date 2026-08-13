import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      toast.success("Logged out successfully");

      setMenuOpen(false);

      navigate("/login");

    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  // ==========================================
  // GET ROLE
  // ==========================================

  const role = user?.role || "";

  const getDashboardPath = () => {
    if (role === "DONOR") {
      return "/dashboard";
    }

    if (role === "NGO") {
      return "/ngo-dashboard";
    }

    if (role === "ADMIN") {
      return "/analytics";
    }

    return "/";
  };

  // ==========================================
  // PUBLIC NAVBAR
  // ==========================================

  if (!isAuthenticated) {
    return (
      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-bold text-green-600"
          >
            Smart Food Waste
          </Link>

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Sign Up
            </Link>

          </div>

        </div>

      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

      <div className="px-6 py-4">

        <div className="flex items-center justify-between">

          {/* LOGO */}

          <Link
            to={getDashboardPath()}
            className="text-2xl font-bold text-green-600"
          >
            Smart Food Waste
          </Link>

          {/* DESKTOP USER */}

          <div className="hidden md:flex items-center gap-4">

            <div className="text-right">

              <p className="font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-500">
                {role}
              </p>

            </div>

            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>

          </div>

          {/* MOBILE BUTTON */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="md:hidden text-gray-700 text-2xl"
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}

        {menuOpen && (

          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">

            <div className="mb-4">

              <p className="font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-gray-500">
                {role}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </nav>
  );
};

export default Navbar;