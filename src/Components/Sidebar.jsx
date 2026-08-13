import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !user) {
    return null;
  }

  const role = user.role;

  // ==========================================
  // COMMON LINK STYLE
  // ==========================================

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
      isActive
        ? "bg-green-100 text-green-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
    }`;

  return (
    <aside className="hidden md:block w-64 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200">

      <div className="p-4">

        {/* ======================================
            USER
        ====================================== */}

        <div className="bg-green-50 rounded-xl p-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">

              <p className="font-semibold text-gray-800 truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-green-600 font-medium">
                {role}
              </p>

            </div>

          </div>

        </div>

        {/* ======================================
            DONOR SIDEBAR
        ====================================== */}

        {role === "DONOR" && (

          <nav className="space-y-2">

            <NavLink
              to="/dashboard"
              className={getLinkClass}
            >
              <span>📊</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/create-donation"
              className={getLinkClass}
            >
              <span>🍱</span>
              Create Donation
            </NavLink>

            <NavLink
              to="/my-donations"
              className={getLinkClass}
            >
              <span>📦</span>
              My Donations
            </NavLink>

            <NavLink
              to="/ngos"
              className={getLinkClass}
            >
              <span>🤝</span>
              NGOs
            </NavLink>

          </nav>

        )}

        {/* ======================================
            NGO SIDEBAR
        ====================================== */}

        {role === "NGO" && (

          <nav className="space-y-2">

            <NavLink
              to="/ngo-dashboard"
              className={getLinkClass}
            >
              <span>📊</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/available-donations"
              className={getLinkClass}
            >
              <span>🍱</span>
              Available Donations
            </NavLink>

            <NavLink
              to="/claims"
              className={getLinkClass}
            >
              <span>📦</span>
              My Claims
            </NavLink>

            <NavLink
              to="/ngos"
              className={getLinkClass}
            >
              <span>🤝</span>
              NGO Directory
            </NavLink>

          </nav>

        )}

        {/* ======================================
            ADMIN SIDEBAR
        ====================================== */}

        {role === "ADMIN" && (

          <nav className="space-y-2">

            <NavLink
              to="/analytics"
              className={getLinkClass}
            >
              <span>📊</span>
              Analytics
            </NavLink>

            <NavLink
              to="/ngos"
              className={getLinkClass}
            >
              <span>🤝</span>
              NGOs
            </NavLink>

          </nav>

        )}

      </div>

    </aside>
  );
};

export default Sidebar;