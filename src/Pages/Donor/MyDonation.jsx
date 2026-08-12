import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyDonations } from "../../api/api";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DONATIONS
  // ==========================================

  const loadDonations = async () => {
    try {
      setLoading(true);

      const response = await getMyDonations();

      console.log(
        "My Donations:",
        response.data
      );

      const data =
        response.data?.donations ||
        response.data?.data ||
        response.data ||
        [];

      setDonations(
        Array.isArray(data) ? data : []
      );

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

  useEffect(() => {
    loadDonations();
  }, []);

  // ==========================================
  // STATUS
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

  return (
    <div>

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            My Donations
          </h1>

          <p className="text-gray-500 mt-1">
            Track all the food donations you
            have created.
          </p>

        </div>

        <Link
          to="/create-donation"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold text-center"
        >
          + Create Donation
        </Link>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading donations...
          </p>
        </div>

      )}

      {/* EMPTY */}

      {!loading && donations.length === 0 && (

        <div className="bg-white rounded-xl shadow-sm p-12 text-center">

          <h2 className="text-xl font-semibold text-gray-800">
            No donations yet
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Start helping reduce food waste by
            creating your first donation.
          </p>

          <Link
            to="/create-donation"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Create Donation
          </Link>

        </div>

      )}

      {/* DONATIONS */}

      {!loading && donations.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {donations.map((donation) => (

            <div
              key={donation._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >

              {/* CARD HEADER */}

              <div className="p-5 border-b">

                <div className="flex items-start justify-between gap-3">

                  <h2 className="text-lg font-bold text-gray-800">
                    {donation.title ||
                      donation.foodName ||
                      "Food Donation"}
                  </h2>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      donation.status
                    )}`}
                  >
                    {donation.status ||
                      "PENDING"}
                  </span>

                </div>

              </div>

              {/* CARD BODY */}

              <div className="p-5 space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Food Type
                  </span>

                  <span className="font-medium text-gray-800">
                    {donation.foodType || "N/A"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Quantity
                  </span>

                  <span className="font-medium text-gray-800">
                    {donation.quantity || "N/A"}{" "}
                    {donation.unit || ""}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Expiry
                  </span>

                  <span className="font-medium text-gray-800">
                    {formatDate(
                      donation.expiryDate
                    )}
                  </span>

                </div>

                <div className="pt-2 border-t">

                  <p className="text-sm text-gray-500">
                    Created
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(
                      donation.createdAt
                    )}
                  </p>

                </div>

              </div>

              {/* CARD FOOTER */}

              <div className="p-5 bg-gray-50">

                <Link
                  to={`/my-donations/${donation._id}`}
                  className="block text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyDonations;