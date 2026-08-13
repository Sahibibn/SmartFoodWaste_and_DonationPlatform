import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getDonationById,
  deleteDonation,
} from "../../api/api";

import RecommendedNGO from "../../Components/RecommendedNGO";

const DonationDetails = () => {
  const { id } = useParams();

  const [donation, setDonation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

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
        "Donation details:",
        response.data
      );

      /*
        Backend may return:

        {
          donation: {...}
        }

        OR

        {
          data: {...}
        }

        OR

        directly {...}
      */

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
  // DELETE DONATION
  // ==========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteDonation(id);

      toast.success(
        "Donation deleted successfully"
      );

      window.location.href =
        "/my-donations";

    } catch (error) {
      console.error(
        "Delete donation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete donation"
      );

    } finally {
      setDeleting(false);
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
            to="/my-donations"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to My Donations
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // DONATION DATA
  // ==========================================

  const donationId =
    donation._id || donation.id;

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

  const pickupLocation =
    donation.pickupLocation ||
    donation.location ||
    donation.address ||
    "Location not specified";

  const description =
    donation.description ||
    "No description provided.";

  const expiryDate =
    donation.expiryDate ||
    donation.expiresAt ||
    donation.expiry;

  const status =
    donation.status ||
    "AVAILABLE";

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleString();
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = () => {
    const normalizedStatus =
      String(status).toUpperCase();

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
  // EXPIRY INFORMATION
  // ==========================================

  const getExpiryInfo = () => {
    if (!expiryDate) {
      return {
        text: "Expiry not specified",
        style: "bg-gray-100 text-gray-600",
      };
    }

    const expiry = new Date(expiryDate);

    if (Number.isNaN(expiry.getTime())) {
      return {
        text: "Expiry not specified",
        style: "bg-gray-100 text-gray-600",
      };
    }

    const now = new Date();

    const hours =
      (expiry.getTime() -
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
        style:
          "bg-orange-100 text-orange-700",
      };
    }

    if (hours <= 48) {
      return {
        text: "Expires within 48 hours",
        style:
          "bg-yellow-100 text-yellow-700",
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
          BACK BUTTON
      ====================================== */}

      <Link
        to="/my-donations"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
      >
        ← Back to My Donations
      </Link>

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Donation Details
          </h1>

          <p className="text-gray-500 mt-1">
            View information about your food donation.
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

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="bg-green-50 p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            <div>

              <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
                Food Donation
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {foodName}
              </h2>

              <p className="text-gray-500 mt-2">
                {foodType}
              </p>

            </div>

            <span
              className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${expiryInfo.style}`}
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

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                📍 Pickup Location
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {pickupLocation}
              </p>

            </div>

            {/* EXPIRY */}

            <div className="border border-gray-200 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                ⏰ Expiry Date
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {formatDate(expiryDate)}
              </p>

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
              ACTIONS
          ==================================== */}

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">

            <Link
              to="/my-donations"
              className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold"
            >
              Back
            </Link>

            {String(status).toUpperCase() ===
              "AVAILABLE" && (

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Donation"}
              </button>

            )}

          </div>

        </div>

      </div>

      {/* ======================================
          RECOMMENDED NGOS
      ====================================== */}

      {donationId && (
        <RecommendedNGO
          donationId={donationId}
        />
      )}

    </div>
  );
};

export default DonationDetails;