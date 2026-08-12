import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getDonationById,
  claimDonation,
} from "../../api/api";

const NGODonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  // ==========================================
  // FETCH DONATION
  // ==========================================

  const loadDonation = async () => {
    try {
      setLoading(true);

      const response = await getDonationById(id);

      setDonation(
        response.data.donation || response.data
      );
    } catch (error) {
      console.error(
        "Failed to load donation:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load donation"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonation();
  }, [id]);

  // ==========================================
  // CLAIM DONATION
  // ==========================================

  const handleClaim = async () => {
    try {
      setClaiming(true);

      await claimDonation(id);

      toast.success(
        "Donation claimed successfully!"
      );

      navigate("/claims");
    } catch (error) {
      console.error(
        "Failed to claim donation:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to claim donation"
      );
    } finally {
      setClaiming(false);
    }
  };

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
  // NOT FOUND
  // ==========================================

  if (!donation) {
    return (
      <div className="text-center py-20">

        <h2 className="text-2xl font-bold text-gray-800">
          Donation not found
        </h2>

        <button
          onClick={() => navigate("/available-donations")}
          className="mt-4 text-green-600 font-semibold"
        >
          ← Back to Donations
        </button>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-6xl mx-auto">

      {/* BACK */}

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-green-600 font-semibold hover:underline"
      >
        ← Back
      </button>

      {/* HEADER */}

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              {donation.foodName ||
                donation.title ||
                "Food Donation"}
            </h1>

            <p className="text-gray-500 mt-2">
              Donation ID: {donation._id || id}
            </p>

          </div>

          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold w-fit">
            {donation.status || "Available"}
          </span>

        </div>

      </div>

      {/* CONTENT */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FOOD DETAILS */}

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Food Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Food Name
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {donation.foodName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Quantity
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {donation.quantity || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Food Type
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {donation.foodType || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Expiry
              </p>

              <p className="font-semibold text-red-600 mt-1">
                {donation.expiryDate
                  ? new Date(
                      donation.expiryDate
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="md:col-span-2">

              <p className="text-sm text-gray-500">
                Description
              </p>

              <p className="text-gray-700 mt-1">
                {donation.description ||
                  "No description available."}
              </p>

            </div>

          </div>

        </div>

        {/* DONOR */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Donor Information
          </h2>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-gray-500">
                Donor
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {donation.donor?.name ||
                  donation.donorName ||
                  "Food Donor"}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {donation.location ||
                  "Location not available"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* CLAIM */}

      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Claim this donation
            </h2>

            <p className="text-gray-500 mt-1">
              Claim this donation to collect and distribute
              the food.
            </p>

          </div>

          <button
            onClick={handleClaim}
            disabled={
              claiming ||
              donation.status === "CLAIMED"
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {claiming
              ? "Claiming..."
              : donation.status === "CLAIMED"
              ? "Already Claimed"
              : "Claim Donation"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default NGODonationDetails;