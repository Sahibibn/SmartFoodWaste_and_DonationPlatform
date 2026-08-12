import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import { getDonationById } from "../../api/api";

const DonationDetails = () => {
  const { id } = useParams();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DONATION
  // ==========================================

  useEffect(() => {
    const loadDonation = async () => {
      try {
        setLoading(true);

        const response =
          await getDonationById(id);

        console.log(
          "Donation Details:",
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

        toast.error(
          error.response?.data?.message ||
            "Failed to load donation"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDonation();
    }
  }, [id]);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "CLAIMED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">

        <p className="text-gray-500">
          Loading donation details...
        </p>

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

        <p className="text-gray-500 mt-2">
          The donation may have been removed
          or does not exist.
        </p>

        <Link
          to="/my-donations"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
        >
          Back to My Donations
        </Link>

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* ======================================
          BACK
      ====================================== */}

      <Link
        to="/my-donations"
        className="inline-block mb-6 text-green-600 hover:text-green-700 font-medium"
      >
        ← Back to My Donations
      </Link>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 md:p-8 border-b">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Donation Details
              </p>

              <h1 className="text-3xl font-bold text-gray-800 mt-1">
                {donation.title ||
                  donation.foodName ||
                  "Food Donation"}
              </h1>

            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                donation.status
              )}`}
            >
              {donation.status || "PENDING"}
            </span>

          </div>

        </div>

        {/* ======================================
            DETAILS
        ====================================== */}

        <div className="p-6 md:p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FOOD TYPE */}

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-sm text-gray-500">
                Food Type
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {donation.foodType || "N/A"}
              </p>

            </div>

            {/* QUANTITY */}

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-sm text-gray-500">
                Quantity
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {donation.quantity || "N/A"}{" "}
                {donation.unit || ""}
              </p>

            </div>

            {/* EXPIRY */}

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-sm text-gray-500">
                Expiry Date
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {formatDateTime(
                  donation.expiryDate
                )}
              </p>

            </div>

            {/* CREATED */}

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-sm text-gray-500">
                Created At
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {formatDateTime(
                  donation.createdAt
                )}
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Description
            </h2>

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-gray-600">
                {donation.description ||
                  "No description provided."}
              </p>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="mt-6">

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Pickup Address
            </h2>

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-gray-600">
                {donation.pickupAddress ||
                  donation.address ||
                  "No pickup address provided."}
              </p>

            </div>

          </div>

          {/* NGO */}

          {donation.claimedBy && (

            <div className="mt-6">

              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Claimed By
              </h2>

              <div className="bg-blue-50 rounded-lg p-5">

                <p className="font-semibold text-gray-800">
                  {donation.claimedBy.name ||
                    "NGO"}
                </p>

                {donation.claimedBy.email && (
                  <p className="text-sm text-gray-500 mt-1">
                    {donation.claimedBy.email}
                  </p>
                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default DonationDetails;