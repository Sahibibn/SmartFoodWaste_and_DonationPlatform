import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const role = user?.role;

  // ==========================================
  // COMMON LINK STYLE
  // ==========================================

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
    }`;

  return (
    <aside className="hidden md:flex w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex-col">

      {/* ======================================
          LOGO
      ====================================== */}

      <div className="p-6 border-b border-gray-100">

        <h2 className="text-xl font-bold text-green-600">
          Smart Food Waste
        </h2>

        {user && (
          <p className="text-xs text-gray-500 mt-1">
            {user.role}
          </p>
        )}

      </div>

      {/* ======================================
          NAVIGATION
      ====================================== */}

      <nav className="p-4 space-y-2 flex-1">

        {/* ====================================
            DONOR LINKS
        ==================================== */}

        {role === "DONOR" && (
          <>
            <NavLink
              to="/dashboard"
              className={linkClass}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/create-donation"
              className={linkClass}
            >
              <span>➕</span>
              <span>Create Donation</span>
            </NavLink>

            <NavLink
              to="/my-donations"
              className={linkClass}
            >
              <span>🍱</span>
              <span>My Donations</span>
            </NavLink>
          </>
        )}

        {/* ====================================
            NGO LINKS
        ==================================== */}

        {role === "NGO" && (
          <>
            <NavLink
              to="/ngo-dashboard"
              className={linkClass}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/available-donations"
              className={linkClass}
            >
              <span>🍱</span>
              <span>Available Donations</span>
            </NavLink>

            <NavLink
              to="/claims"
              className={linkClass}
            >
              <span>📦</span>
              <span>My Claims</span>
            </NavLink>
          </>
        )}

        {/* ====================================
            ADMIN
        ==================================== */}

        {role === "ADMIN" && (
          <>
            <NavLink
              to="/analytics"
              className={linkClass}
            >
              <span>📊</span>
              <span>Analytics</span>
            </NavLink>
          </>
        )}

        {/* ====================================
            ANALYTICS
        ==================================== */}

        {role === "DONOR" && (
          <NavLink
            to="/analytics"
            className={linkClass}
          >
            <span>📈</span>
            <span>Analytics</span>
          </NavLink>
        )}

        {role === "NGO" && (
          <NavLink
            to="/analytics"
            className={linkClass}
          >
            <span>📈</span>
            <span>Analytics</span>
          </NavLink>
        )}

      </nav>

    </aside>
  );
};

export default Sidebar;