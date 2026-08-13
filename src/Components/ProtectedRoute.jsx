import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  // ==========================================
  // CHECKING AUTHENTICATION
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Checking authentication...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ==========================================
  // ALLOWED
  // ==========================================

  return children;
};

export default ProtectedRoute;