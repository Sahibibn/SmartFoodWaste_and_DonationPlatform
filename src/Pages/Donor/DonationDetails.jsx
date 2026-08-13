import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getDonationById,
  getNGOs,
} from "../../api/api";

import RecommendedNGO from "../../Components/RecommendedNGO";
import DonationMap from "../../Components/DonationMap";

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [donation, setDonation] = useState(null);

  // NGO STATE
  const [ngos, setNgos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DONATION + NGOs
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // ======================================
        // GET DONATION
        // ======================================

        const donationResponse =
          await getDonationById(id);

        console.log(
          "Donation Response:",
          donationResponse.data
        );

        const donationData =
          donationResponse.data?.donation ||
          donationResponse.data;

        setDonation(donationData);

        // ======================================
        // GET NGOs
        // ======================================

        const ngoResponse =
          await getNGOs();

        console.log(
          "NGO Response:",
          ngoResponse.data
        );

        const ngoData =
          ngoResponse.data?.ngos ||
          ngoResponse.data;

        setNgos(
          Array.isArray(ngoData)
            ? ngoData
            : []
        );

      } catch (err) {
        console.error(
          "Failed to load donation details:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Failed to load donation details";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />

          <div className="h-7 bg-gray-200 rounded w-56 animate-pulse" />

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">

          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-20 bg-gray-200 rounded-lg" />

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() =>
            navigate("/my-donations")
          }
          className="mb-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ← Back to My Donations
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Unable to load donation
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // DONATION NOT FOUND
  // ==========================================

  if (!donation) {
    return (
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() =>
            navigate("/my-donations")
          }
          className="mb-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ← Back to My Donations
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

          <div className="text-5xl mb-4">
            🍱
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Donation not found
          </h2>

          <p className="text-gray-500 mt-2">
            This donation may have been deleted
            or does not exist.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // VALUES
  // ==========================================

  const foodName =
    donation.foodName ||
    donation.title ||
    donation.foodType ||
    "Food Donation";

  const category =
    donation.category ||
    donation.foodCategory ||
    "Not specified";

  const quantity =
    donation.quantity ??
    donation.amount ??
    "Not specified";

  const unit =
    donation.unit || "";

  const description =
    donation.description ||
    "No description provided.";

  const address =
    donation.address ||
    donation.location?.address ||
    "Address not available";

  const status =
    donation.status ||
    "AVAILABLE";

  const expiryDate =
    donation.expiryDate ||
    donation.expiry ||
    donation.expiryAt;

  const createdAt =
    donation.createdAt;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = () => {
    switch (
      status.toUpperCase()
    ) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";

      case "CLAIMED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-purple-100 text-purple-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // CHECK EXPIRY
  // ==========================================

  const isExpired = () => {
    if (!expiryDate) {
      return false;
    }

    return (
      new Date(expiryDate) <
      new Date()
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-6xl mx-auto">

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <button
        onClick={() =>
          navigate("/my-donations")
        }
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition"
      >
        ← Back to My Donations
      </button>

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Donation Details
          </h1>

          <p className="text-gray-500 mt-1">
            View complete information about
            your food donation.
          </p>

        </div>

        <span
          className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle()}`}
        >
          {status}
        </span>

      </div>

      {/* ======================================
          MAIN DONATION CARD
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* CARD HEADER */}

        <div className="bg-green-50 border-b border-green-100 p-6">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
              🍱
            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-bold text-gray-800">
                {foodName}
              </h2>

              <p className="text-gray-500 mt-1">
                Donation ID:{" "}
                <span className="font-mono text-xs">
                  {donation._id}
                </span>
              </p>

            </div>

          </div>

        </div>

        {/* ====================================
            DONATION INFORMATION
        ==================================== */}

        <div className="p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-5">
            Food Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* CATEGORY */}

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-semibold">
                Category
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {category}
              </p>

            </div>

            {/* QUANTITY */}

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-semibold">
                Quantity
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {quantity} {unit}
              </p>

            </div>

            {/* CREATED */}

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500 uppercase font-semibold">
                Created
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {formatDate(
                  createdAt
                )}
              </p>

            </div>

            {/* EXPIRY */}

            <div
              className={`rounded-xl p-4 ${
                isExpired()
                  ? "bg-red-50"
                  : "bg-gray-50"
              }`}
            >

              <p className="text-xs text-gray-500 uppercase font-semibold">
                Expiry
              </p>

              <p
                className={`font-semibold mt-2 ${
                  isExpired()
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
              >
                {formatDate(
                  expiryDate
                )}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <div className="px-6 pb-6">

          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Description
          </h3>

          <div className="bg-gray-50 rounded-xl p-5">

            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>

          </div>

        </div>

        {/* ====================================
            LOCATION
        ==================================== */}

        <div className="px-6 pb-6">

          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Donation Location
          </h3>

          <div className="bg-gray-50 rounded-xl p-5">

            <div className="flex gap-3">

              <div className="text-2xl">
                📍
              </div>

              <div>

                <p className="font-semibold text-gray-800">
                  Pickup Location
                </p>

                <p className="text-gray-500 mt-1">
                  {address}
                </p>

              </div>

            </div>

            {/* COORDINATES */}

            {donation.location
              ?.latitude !==
              undefined &&
              donation.location
                ?.longitude !==
                undefined && (
                <div className="mt-4 pt-4 border-t border-gray-200">

                  <p className="text-xs text-gray-500">
                    Coordinates
                  </p>

                  <p className="font-mono text-sm text-gray-700 mt-1">
                    {donation.location.latitude},{" "}
                    {donation.location.longitude}
                  </p>

                </div>
              )}

          </div>

        </div>

      </div>

      {/* ======================================
          MAP
      ====================================== */}

      <div className="mt-6">

        <DonationMap
          donation={donation}
          ngos={ngos}
        />

      </div>

      {/* ======================================
          RECOMMENDED NGOs
      ====================================== */}

      <div className="mt-6">

        <RecommendedNGO
          donationId={donation._id}
        />

      </div>

      {/* ======================================
          FOOTER INFORMATION
      ====================================== */}

      <div className="mt-6 mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5">

        <div className="flex gap-3">

          <div className="text-xl">
            💡
          </div>

          <div>

            <h3 className="font-semibold text-blue-800">
              Smart Recommendation
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              Recommended NGOs are ranked based
              on their distance from your donation
              location.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DonationDetails;