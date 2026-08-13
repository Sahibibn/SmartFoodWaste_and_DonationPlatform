import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  // ==========================================
  // CHECKING AUTH
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    // DONOR trying NGO page
    if (user.role === "DONOR") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    // NGO trying DONOR page
    if (user.role === "NGO") {
      return (
        <Navigate
          to="/ngo-dashboard"
          replace
        />
      );
    }

    // ADMIN
    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/analytics"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  // ==========================================
  // ALLOWED
  // ==========================================

  return <Outlet />;
};

export default ProtectedRoute;