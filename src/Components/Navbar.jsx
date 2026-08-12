import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      <h1 className="text-xl font-bold text-green-600">
        Smart Food Waste
      </h1>

      <div className="flex items-center gap-4">

        {user && (
          <div className="text-right">
            <p className="font-semibold text-gray-800">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              {user.role}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>

      </div>

    </nav>
  );
};

export default Navbar;