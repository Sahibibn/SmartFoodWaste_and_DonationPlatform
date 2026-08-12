import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getMyDonations } from "../../api/api";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DONATIONS
  // ==========================================

  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);

        const response = await getMyDonations();

        console.log("My Donations:", response.data);

        const data =
          response.data?.donations ||
          response.data?.data ||
          response.data ||
          [];

        setDonations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load donations:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load donations"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  // ==========================================
  // STATS
  // ==========================================

  const totalDonations = donations.length;

  const pendingDonations = donations.filter(
    (donation) =>
      donation.status?.toUpperCase() === "PENDING"
  ).length;

  const claimedDonations = donations.filter(
    (donation) =>
      donation.status?.toUpperCase() === "CLAIMED"
  ).length;

  const completedDonations = donations.filter(
    (donation) =>
      donation.status?.toUpperCase() === "COMPLETED"
  ).length;

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "CLAIMED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-gray-500">
            Welcome back,
          </p>

          <h1 className="text-3xl font-bold text-gray-800">
            {user?.name || "Donor"}
          </h1>

          <p className="text-gray-500 mt-1">
            Help reduce food waste by sharing
            surplus food.
          </p>
        </div>

        <Link
          to="/create-donation"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold text-center transition"
        >
          + Create Donation
        </Link>

      </div>

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <p className="text-sm text-gray-500">
            Total Donations
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {loading ? "..." : totalDonations}
          </h2>

        </div>

        {/* PENDING */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {loading ? "..." : pendingDonations}
          </h2>

        </div>

        {/* CLAIMED */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <p className="text-sm text-gray-500">
            Claimed
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : claimedDonations}
          </h2>

        </div>

        {/* COMPLETED */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : completedDonations}
          </h2>

        </div>

      </div>

      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Link
            to="/create-donation"
            className="bg-green-50 border border-green-100 rounded-xl p-6 hover:bg-green-100 transition"
          >

            <h3 className="text-lg font-bold text-green-700">
              Create Donation
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Share your surplus food with NGOs
              and people in need.
            </p>

          </Link>

          <Link
            to="/my-donations"
            className="bg-blue-50 border border-blue-100 rounded-xl p-6 hover:bg-blue-100 transition"
          >

            <h3 className="text-lg font-bold text-blue-700">
              My Donations
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              View and track all your food
              donations.
            </p>

          </Link>

        </div>

      </div>

      {/* ======================================
          RECENT DONATIONS
      ====================================== */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="flex items-center justify-between p-6 border-b">

          <h2 className="text-xl font-bold text-gray-800">
            Recent Donations
          </h2>

          <Link
            to="/my-donations"
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            View All
          </Link>

        </div>

        <div className="p-6">

          {loading ? (

            <div className="text-center py-10 text-gray-500">
              Loading donations...
            </div>

          ) : donations.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500 mb-4">
                You haven't created any donations
                yet.
              </p>

              <Link
                to="/create-donation"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Create Your First Donation
              </Link>

            </div>

          ) : (

            <div className="space-y-4">

              {donations
                .slice(0, 5)
                .map((donation) => (

                  <div
                    key={donation._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-lg p-4"
                  >

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {donation.title ||
                          donation.foodName ||
                          "Food Donation"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity:{" "}
                        {donation.quantity || "N/A"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Created:{" "}
                        {formatDate(
                          donation.createdAt
                        )}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          donation.status
                        )}`}
                      >
                        {donation.status ||
                          "PENDING"}
                      </span>

                      {donation._id && (
                        <Link
                          to={`/my-donations/${donation._id}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      )}

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default DonorDashboard;