import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getClaimById,
} from "../../api/api";

import StatusBadge from "../../Components/StatusBadge";

const ClaimDetails = () => {
  const { id } = useParams();

  const [claim, setClaim] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD CLAIM
  // ==========================================

  const loadClaim = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getClaimById(id);

      const data =
        response.data?.claim ||
        response.data?.data ||
        response.data;

      setClaim(data);

    } catch (error) {
      console.error(
        "Failed to load claim:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load claim"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadClaim();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center py-20">

        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

          <h2 className="text-xl font-bold text-red-700">
            Unable to load claim
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <Link
            to="/claims"
            className="inline-block mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Back to Claims
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!claim) {
    return (
      <div className="text-center py-20">

        <div className="text-6xl mb-4">
          📦
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Claim not found
        </h2>

        <Link
          to="/claims"
          className="inline-block mt-5 text-green-600 font-semibold"
        >
          ← Back to Claims
        </Link>

      </div>
    );
  }

  // ==========================================
  // DONATION
  // ==========================================

  const donation =
    typeof claim.donation === "object"
      ? claim.donation
      : null;

  const foodName =
    donation?.foodName ||
    donation?.title ||
    claim.foodName ||
    "Food Donation";

  const quantity =
    donation?.quantity ||
    claim.quantity ||
    "Not specified";

  const location =
    typeof donation?.location ===
    "object"
      ? donation.location?.address ||
        "Location available"
      : donation?.location ||
        claim.location ||
        "Not specified";

  const status =
    claim.status ||
    donation?.status ||
    "CLAIMED";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* BACK */}

      <Link
        to="/claims"
        className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
      >
        ← Back to My Claims
      </Link>

      {/* CARD */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* IMAGE */}

        {donation?.image ? (
          <img
            src={donation.image}
            alt={foodName}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-72 bg-green-50 flex items-center justify-center text-8xl">
            🍱
          </div>
        )}

        <div className="p-6 md:p-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                {foodName}
              </h1>

              <p className="text-gray-500 mt-1">
                Claim details
              </p>

            </div>

            <StatusBadge
              status={status}
            />

          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Quantity
              </p>

              <p className="text-lg font-semibold mt-1">
                {quantity}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Pickup Location
              </p>

              <p className="text-lg font-semibold mt-1">
                {location}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Claim ID
              </p>

              <p className="text-sm font-semibold mt-1 break-all">
                {claim._id || claim.id}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Claimed On
              </p>

              <p className="text-lg font-semibold mt-1">
                {claim.createdAt
                  ? new Date(
                      claim.createdAt
                    ).toLocaleDateString()
                  : "Not available"}
              </p>

            </div>

          </div>

          {/* EXPIRY */}

          {donation?.expiryDate && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">

              <p className="text-sm text-yellow-700">
                Food Expiry Date
              </p>

              <p className="font-bold text-yellow-800 mt-1">
                {new Date(
                  donation.expiryDate
                ).toLocaleDateString()}
              </p>

            </div>
          )}

          {/* DESCRIPTION */}

          {donation?.description && (
            <div className="mt-8">

              <h2 className="text-lg font-bold text-gray-800">
                Donation Description
              </h2>

              <p className="text-gray-600 mt-2 leading-relaxed">
                {donation.description}
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ClaimDetails;