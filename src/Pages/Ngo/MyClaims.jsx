import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyClaims } from "../../api/api";

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CLAIMS
  // ==========================================

  const loadClaims = async () => {
    try {
      setLoading(true);

      const response = await getMyClaims();

      setClaims(
        response.data.claims ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to load claims:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load claims"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          My Claims
        </h1>

        <p className="text-gray-500 mt-2">
          Track the food donations claimed by your NGO.
        </p>

      </div>

      {/* EMPTY */}

      {claims.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

          <div className="text-5xl mb-4">
            📦
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No Claims Yet
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't claimed any donations yet.
          </p>

          <Link
            to="/available-donations"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Find Donations
          </Link>

        </div>

      ) : (

        /* CLAIMS GRID */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {claims.map((claim) => {

            const donation =
              claim.donation || claim;

            const donationId =
              donation._id ||
              claim.donationId;

            return (
              <div
                key={claim._id || donationId}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="p-6">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold text-gray-800">
                      {donation.foodName ||
                        donation.title ||
                        "Food Donation"}
                    </h2>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {claim.status ||
                        donation.status ||
                        "CLAIMED"}
                    </span>

                  </div>

                  {/* INFO */}

                  <div className="mt-5 space-y-3">

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Quantity
                      </span>

                      <span className="font-semibold text-gray-800">
                        {donation.quantity || "N/A"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Food Type
                      </span>

                      <span className="font-semibold text-gray-800">
                        {donation.foodType || "N/A"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Claimed On
                      </span>

                      <span className="font-semibold text-gray-800">
                        {claim.createdAt
                          ? new Date(
                              claim.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>

                    </div>

                  </div>

                  {/* BUTTON */}

                  {donationId && (
                    <Link
                      to={`/donation/${donationId}`}
                      className="block text-center mt-6 bg-gray-100 hover:bg-green-100 text-green-700 font-semibold py-3 rounded-lg transition"
                    >
                      View Donation
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