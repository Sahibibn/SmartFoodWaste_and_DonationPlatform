import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">

        <div className="text-6xl mb-4">
          🚫
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Access Denied
        </h1>

        <p className="text-gray-500 mt-3">
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