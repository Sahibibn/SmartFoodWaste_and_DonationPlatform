import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

  const [error, setError] = useState("");

  // ==========================================
  // LOAD DONATION
  // ==========================================

  const loadDonation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDonationById(id);

      console.log(
        "NGO Donation Details:",
        response.data
      );

      const data =
        response.data?.donation ||
        response.data?.data ||
        response.data;

      setDonation(data);

    } catch (error) {
      console.error(
        "Failed to load donation:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to load donation details";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    if (id) {
      loadDonation();
    }
  }, [id]);

  // ==========================================
  // CLAIM DONATION
  // ==========================================

  const handleClaim = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to claim this donation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setClaiming(true);

      await claimDonation(id);

      toast.success(
        "Donation claimed successfully!"
      );

      navigate("/claims");

    } catch (error) {
      console.error(
        "Claim donation error:",
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
      <div className="flex justify-center items-center py-20">

        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !donation) {
    return (
      <div className="max-w-xl mx-auto py-20">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-700">
            Donation Not Found
          </h2>

          <p className="text-red-600 mt-2">
            {error ||
              "Unable to find this donation."}
          </p>

          <Link
            to="/available-donations"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Available Donations
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // DONATION DATA
  // ==========================================

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

  const description =
    donation.description ||
    "No description provided.";

  const expiry =
    donation.expiryDate ||
    donation.expiresAt ||
    donation.expiry;

  const status =
    donation.status ||
    "AVAILABLE";

  // ==========================================
  // STATUS
  // ==========================================

  const normalizedStatus =
    String(status).toUpperCase();

  const isAvailable =
    normalizedStatus === "AVAILABLE";

  const getStatusStyle = () => {
    if (normalizedStatus === "AVAILABLE") {
      return "bg-green-100 text-green-700";
    }

    if (normalizedStatus === "CLAIMED") {
      return "bg-blue-100 text-blue-700";
    }

    if (normalizedStatus === "EXPIRED") {
      return "bg-red-100 text-red-700";
    }

    if (normalizedStatus === "COMPLETED") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ==========================================
  // EXPIRY
  // ==========================================

  const getExpiryInfo = () => {
    if (!expiry) {
      return {
        text: "Expiry not specified",
        style: "bg-gray-100 text-gray-600",
      };
    }

    const expiryDate = new Date(expiry);

    if (Number.isNaN(expiryDate.getTime())) {
      return {
        text: "Expiry not specified",
        style: "bg-gray-100 text-gray-600",
      };
    }

    const now = new Date();

    const hours =
      (expiryDate.getTime() -
        now.getTime()) /
      (1000 * 60 * 60);

    if (hours <= 0) {
      return {
        text: "Expired",
        style: "bg-red-100 text-red-700",
      };
    }

    if (hours <= 24) {
      return {
        text: "Expires within 24 hours",
        style: "bg-orange-100 text-orange-700",
      };
    }

    if (hours <= 48) {
      return {
        text: "Expires within 48 hours",
        style: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "Fresh",
      style: "bg-green-100 text-green-700",
    };
  };

  const expiryInfo = getExpiryInfo();

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ======================================
          BACK
      ====================================== */}

      <Link
        to="/available-donations"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
      >
        ← Back to Available Donations
      </Link>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Donation Details
          </h1>

          <p className="text-gray-500 mt-1">
            Review this donation before claiming it.
          </p>

        </div>

        <span
          className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle()}`}
        >
          {normalizedStatus}
        </span>

      </div>

      {/* ======================================
          MAIN CARD
      ====================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="bg-green-50 p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:justify-between gap-5">

            <div>

              <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
                Available Food
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {foodName}
              </h2>

              <p className="text-gray-500 mt-2">
                {foodType}
              </p>

            </div>

            <span
              className={`h-fit w-fit px-4 py-2 rounded-full text-sm font-semibold ${expiryInfo.style}`}
            >
              {expiryInfo.text}
            </span>

          </div>

        </div>

        {/* DETAILS */}

        <div className="p-6 md:p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* QUANTITY */}

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Quantity
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                {quantity} {unit}
              </p>

            </div>

            {/* FOOD TYPE */}

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Food Type
              </p>

              <p className="text-lg font-bold text-gray-800 mt-2">
                {foodType}
              </p>

            </div>

            {/* LOCATION */}

            <div className="border border-gray-200 rounded-xl p-5 md:col-span-2">

              <p className="text-sm text-gray-500">
                📍 Pickup Location
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {location}
              </p>

            </div>

            {/* EXPIRY */}

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                ⏰ Expiry Date
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {expiry
                  ? new Date(
                      expiry
                    ).toLocaleString()
                  : "Not specified"}
              </p>

            </div>

            {/* STATUS */}

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Donation Status
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle()}`}
              >
                {normalizedStatus}
              </span>

            </div>

          </div>

          {/* ====================================
              DESCRIPTION
          ==================================== */}

          <div className="mt-6 border border-gray-200 rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="text-gray-700 mt-2 leading-relaxed">
              {description}
            </p>

          </div>

          {/* ====================================
              COORDINATES
          ==================================== */}

          {(donation.latitude !==
            undefined ||
            donation.longitude !==
              undefined) && (

            <div className="mt-6">

              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Pickup Coordinates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Latitude
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {donation.latitude ??
                      "Not available"}
                  </p>

                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Longitude
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {donation.longitude ??
                      "Not available"}
                  </p>

                </div>

              </div>

            </div>

          )}

          {/* ====================================
              CLAIM SECTION
          ==================================== */}

          <div className="mt-8 pt-6 border-t border-gray-200">

            {isAvailable ? (

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                <h3 className="text-lg font-bold text-green-800">
                  Ready to claim?
                </h3>

                <p className="text-green-700 text-sm mt-1">
                  Claim this donation if your NGO can
                  collect the food before it expires.
                </p>

                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="mt-4 w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  {claiming
                    ? "Claiming..."
                    : "Claim Donation"}
                </button>

              </div>

            ) : (

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                <h3 className="text-lg font-bold text-gray-700">
                  Donation unavailable
                </h3>

                <p className="text-gray-500 mt-1">
                  This donation is no longer available
                  for claiming.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default NGODonationDetails;