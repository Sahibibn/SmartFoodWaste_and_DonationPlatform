import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getAvailableDonations,
  getMyClaims,
} from "../../api/api";

const NGODashboard = () => {
  const [available, setAvailable] =
    useState([]);

  const [claims, setClaims] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          donationsResponse,
          claimsResponse,
        ] = await Promise.all([
          getAvailableDonations(),
          getMyClaims(),
        ]);

        const donations =
          donationsResponse.data?.donations ||
          donationsResponse.data ||
          [];

        const myClaims =
          claimsResponse.data?.claims ||
          claimsResponse.data ||
          [];

        setAvailable(
          Array.isArray(donations)
            ? donations
            : []
        );

        setClaims(
          Array.isArray(myClaims)
            ? myClaims
            : []
        );
      } catch (error) {
        console.error(
          "NGO dashboard error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">

        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            NGO Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Find food donations and manage your claims.
          </p>

        </div>

        <Link
          to="/available-donations"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center"
        >
          Find Donations
        </Link>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Available Donations
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {available.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            My Claims
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {claims.length}
          </h2>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          to="/available-donations"
          className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition"
        >

          <div className="text-4xl mb-4">
            🍱
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Available Donations
          </h2>

          <p className="text-gray-500 mt-2">
            Browse food donations available near you.
          </p>

        </Link>

        <Link
          to="/claims"
          className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition"
        >

          <div className="text-4xl mb-4">
            📦
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            My Claims
          </h2>

          <p className="text-gray-500 mt-2">
            Track all donations claimed by your NGO.
          </p>

        </Link>

      </div>

    </div>
  );
};

export default NGODashboard;