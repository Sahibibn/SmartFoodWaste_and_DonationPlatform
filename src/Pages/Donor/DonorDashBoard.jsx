import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyDonations } from "../../api/api";

const DonorDashboard = () => {
  const [donations, setDonations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response =
          await getMyDonations();

        const data =
          response.data?.donations ||
          response.data ||
          [];

        setDonations(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
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

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalDonations =
    donations.length;

  const availableDonations =
    donations.filter(
      (item) =>
        String(item.status || "AVAILABLE")
          .toUpperCase() === "AVAILABLE"
    ).length;

  const claimedDonations =
    donations.filter(
      (item) =>
        String(item.status || "")
          .toUpperCase() === "CLAIMED"
    ).length;

  const expiredDonations =
    donations.filter(
      (item) =>
        String(item.status || "")
          .toUpperCase() === "EXPIRED"
    ).length;

  // ==========================================
  // LOADING
  // ==========================================

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
            Donor Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your food donations and help reduce food waste.
          </p>

        </div>

        <Link
          to="/create-donation"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center"
        >
          + Create Donation
        </Link>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Total Donations
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {totalDonations}
          </h2>

        </div>

        {/* AVAILABLE */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Available
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {availableDonations}
          </h2>

        </div>

        {/* CLAIMED */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Claimed
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {claimedDonations}
          </h2>

        </div>

        {/* EXPIRED */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Expired
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {expiredDonations}
          </h2>

        </div>

      </div>

      {/* RECENT DONATIONS */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            Recent Donations
          </h2>

          <Link
            to="/my-donations"
            className="text-green-600 font-semibold hover:underline"
          >
            View All
          </Link>

        </div>

        {donations.length === 0 ? (

          <div className="text-center py-10">

            <p className="text-gray-500">
              You haven't created any donations yet.
            </p>

            <Link
              to="/create-donation"
              className="inline-block mt-4 text-green-600 font-semibold"
            >
              Create your first donation →
            </Link>

          </div>

        ) : (

          <div className="space-y-4">

            {donations
              .slice(0, 5)
              .map((donation) => (

                <div
                  key={donation._id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>

                    <h3 className="font-bold text-gray-800">
                      {donation.foodName ||
                        donation.title ||
                        "Food Donation"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {donation.quantity ||
                        "N/A"}{" "}
                      •{" "}
                      {donation.foodType ||
                        "N/A"}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {donation.status ||
                        "AVAILABLE"}
                    </span>

                    <Link
                      to={`/my-donations/${donation._id}`}
                      className="text-green-600 font-semibold"
                    >
                      View
                    </Link>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default DonorDashboard;