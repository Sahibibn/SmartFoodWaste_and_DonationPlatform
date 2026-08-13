import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyClaims } from "../../api/api";

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ==========================================
  // LOAD MY CLAIMS
  // ==========================================

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyClaims();

      console.log("My Claims:", response.data);

      const data =
        response.data?.claims ||
        response.data?.data ||
        response.data ||
        [];

      setClaims(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load claims:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to load your claims";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    const normalized =
      String(status || "").toUpperCase();

    if (
      normalized === "APPROVED" ||
      normalized === "ACCEPTED" ||
      normalized === "COMPLETED"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalized === "PENDING" ||
      normalized === "PROCESSING"
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      normalized === "REJECTED" ||
      normalized === "CANCELLED"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ==========================================
  // FILTER CLAIMS
  // ==========================================

  const filteredClaims = claims.filter((claim) => {
    const donation =
      claim.donation ||
      claim.donationId ||
      {};

    const foodName =
      donation.foodName ||
      donation.title ||
      donation.name ||
      "";

    const claimStatus =
      claim.status || "PENDING";

    const matchesSearch = foodName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      String(claimStatus).toUpperCase() ===
        statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-20">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-700">
            Unable to Load Claims
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <button
            onClick={loadClaims}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          My Claims
        </h1>

        <p className="text-gray-500 mt-2">
          Track all food donations claimed by your NGO.
        </p>

      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* SEARCH */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Food
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search claimed food..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* STATUS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="APPROVED">
                Approved
              </option>

              <option value="ACCEPTED">
                Accepted
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Total Claims
          </p>

          <p className="text-3xl font-bold text-gray-800 mt-2">
            {claims.length}
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {
              claims.filter(
                (claim) =>
                  String(
                    claim.status || "PENDING"
                  ).toUpperCase() === "PENDING"
              ).length
            }
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              claims.filter(
                (claim) =>
                  String(claim.status || "")
                    .toUpperCase() === "COMPLETED"
              ).length
            }
          </p>

        </div>

      </div>

      {/* ======================================
          EMPTY
      ====================================== */}

      {filteredClaims.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            📦
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Claims Found
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't claimed any donations matching
            your filters.
          </p>

          <Link
            to="/available-donations"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Find Donations
          </Link>

        </div>

      ) : (

        /* ======================================
           CLAIMS
        ====================================== */

        <div className="space-y-5">

          {filteredClaims.map((claim) => {

            const donation =
              claim.donation ||
              claim.donationId ||
              {};

            const donationId =
              donation._id ||
              donation.id ||
              claim.donationId;

            const claimId =
              claim._id ||
              claim.id;

            const foodName =
              donation.foodName ||
              donation.title ||
              donation.name ||
              "Food Donation";

            const foodType =
              donation.foodType ||
              donation.category ||
              donation.type ||
              "Food";

            const quantity =
              donation.quantity ??
              donation.amount ??
              "N/A";

            const unit =
              donation.unit || "";

            const location =
              donation.pickupLocation ||
              donation.location ||
              donation.address ||
              "Location not specified";

            const status =
              claim.status || "PENDING";

            const claimedAt =
              claim.createdAt ||
              claim.claimedAt;

            const expiry =
              donation.expiryDate ||
              donation.expiresAt ||
              donation.expiry;

            return (
              <div
                key={claimId}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* TOP */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <p className="text-xs uppercase font-semibold text-green-600">
                      {foodType}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {foodName}
                    </h2>

                  </div>

                  <span
                    className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                      status
                    )}`}
                  >
                    {String(status).toUpperCase()}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Quantity
                    </p>

                    <p className="font-bold text-gray-800 mt-1">
                      {quantity} {unit}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Claimed On
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {claimedAt
                        ? new Date(
                            claimedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Expiry
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {expiry
                        ? new Date(
                            expiry
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Pickup
                    </p>

                    <p className="font-semibold text-gray-800 mt-1 truncate">
                      {location}
                    </p>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="mt-5">

                  <p className="text-sm text-gray-500">
                    📍 Pickup Location
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {location}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-200">

                  {donationId && (
                    <Link
                      to={`/donation/${donationId}`}
                      className="text-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                    >
                      View Donation
                    </Link>
                  )}

                  {claimId && (
                    <Link
                      to={`/claims/${claimId}`}
                      className="text-center border border-green-600 text-green-600 hover:bg-green-50 px-5 py-3 rounded-lg font-semibold transition"
                    >
                      Claim Details
                    </Link>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default MyClaims;