import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="text-center">

        <h1 className="text-7xl font-bold text-red-500">
          403
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          Access Denied
        </h2>

        <p className="text-gray-500 mt-2">
          You don't have permission to access this page.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Go Home
        </Link>

      </div>

    </div>
  );
};

export default Unauthorized;