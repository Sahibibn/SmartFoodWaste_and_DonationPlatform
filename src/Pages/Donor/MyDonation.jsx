import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyDonations,
  deleteDonation,
} from "../../api/api";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  // ==========================================
  // LOAD DONATIONS
  // ==========================================

  const loadDonations = async () => {
    try {
      setLoading(true);

      const response = await getMyDonations();

      const data =
        response.data?.donations ||
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
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteDonation(id);

      setDonations((prev) =>
        prev.filter(
          (donation) => donation._id !== id
        )
      );

      toast.success(
        "Donation deleted successfully"
      );
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
      setDeletingId(null);
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

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            My Donations
          </h1>

          <p className="text-gray-500 mt-2">
            Manage the food donations you have created.
          </p>

        </div>

        <Link
          to="/create-donation"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold text-center"
        >
          + Create Donation
        </Link>

      </div>

      {/* EMPTY */}

      {donations.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

          <div className="text-5xl mb-4">
            🍱
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No Donations Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first food donation.
          </p>

          <Link
            to="/create-donation"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Donation
          </Link>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {donations.map((donation) => (

            <div
              key={donation._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >

              <div className="p-6">

                {/* TITLE */}

                <div className="flex items-start justify-between gap-3">

                  <h2 className="text-xl font-bold text-gray-800">
                    {donation.foodName ||
                      donation.title ||
                      "Food Donation"}
                  </h2>

                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {donation.status ||
                      "AVAILABLE"}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-5 space-y-3">

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Type
                    </span>

                    <span className="font-semibold text-gray-800 text-right">
                      {donation.foodType || "N/A"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Quantity
                    </span>

                    <span className="font-semibold text-gray-800">
                      {donation.quantity || "N/A"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Location
                    </span>

                    <span className="font-semibold text-gray-800 text-right">
                      {donation.location || "N/A"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Expiry
                    </span>

                    <span className="font-semibold text-red-600">
                      {donation.expiryDate
                        ? new Date(
                            donation.expiryDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-3 mt-6">

                  <Link
                    to={`/my-donations/${donation._id}`}
                    className="flex-1 text-center bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-lg font-semibold"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(donation._id)
                    }
                    disabled={
                      deletingId === donation._id
                    }
                    className="flex-1 bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 disabled:text-gray-400 py-2.5 rounded-lg font-semibold"
                  >
                    {deletingId === donation._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyDonations;