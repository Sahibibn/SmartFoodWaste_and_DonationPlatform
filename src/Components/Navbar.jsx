import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [menuOpen, setMenuOpen] =
    useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      toast.success(
        "Logged out successfully"
      );

      navigate("/login");

    } catch (error) {
      toast.error(
        error || "Logout failed"
      );
    }
  };

  // ==========================================
  // ROLE
  // ==========================================

  const role = user?.role;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">

      {/* ======================================
          LOGO
      ====================================== */}

      <Link
        to={
          role === "DONOR"
            ? "/dashboard"
            : role === "NGO"
            ? "/ngo-dashboard"
            : "/"
        }
        className="text-xl md:text-2xl font-bold text-green-600"
      >
        Smart Food Waste
      </Link>

      {/* ======================================
          DESKTOP USER
      ====================================== */}

      <div className="hidden md:flex items-center gap-5">

        {user ? (
          <>

            {/* USER INFO */}

            <div className="text-right">

              <p className="font-semibold text-gray-800">
                {user.name || "User"}
              </p>

              <p className="text-xs text-gray-500">
                {role}
              </p>

            </div>

            {/* AVATAR */}

            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition"
            >
              Logout
            </button>

          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-green-600 font-semibold"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>

      {/* ======================================
          MOBILE MENU BUTTON
      ====================================== */}

      <button
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* ======================================
          MOBILE MENU
      ====================================== */}

      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-4 md:hidden">

          {user ? (
            <div className="space-y-3">

              <div className="pb-3 border-b">

                <p className="font-semibold">
                  {user.name || "User"}
                </p>

                <p className="text-sm text-gray-500">
                  {role}
                </p>

              </div>

              {/* DONOR */}

              {role === "DONOR" && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/create-donation"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    Create Donation
                  </Link>

                  <Link
                    to="/my-donations"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    My Donations
                  </Link>
                </>
              )}

              {/* NGO */}

              {role === "NGO" && (
                <>
                  <Link
                    to="/ngo-dashboard"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/available-donations"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    Available Donations
                  </Link>

                  <Link
                    to="/claims"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block py-2"
                  >
                    My Claims
                  </Link>
                </>
              )}

              {/* ANALYTICS */}

              <Link
                to="/analytics"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="block py-2"
              >
                Analytics
              </Link>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-red-600 font-semibold"
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="space-y-3">

              <Link
                to="/login"
                className="block py-2"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="block bg-green-600 text-white text-center py-2 rounded-lg"
              >
                Sign Up
              </Link>

            </div>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;