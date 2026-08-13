import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getAvailableDonations } from "../../api/api";

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("ALL");

  // ==========================================
  // LOAD AVAILABLE DONATIONS
  // ==========================================

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAvailableDonations();

      console.log("Available donations:", response.data);

      const data =
        response.data?.donations ||
        response.data?.data ||
        response.data ||
        [];

      setDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load available donations:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to load available donations";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredDonations = donations.filter((donation) => {
    const name =
      donation.foodName ||
      donation.title ||
      donation.name ||
      "";

    const type =
      donation.foodType ||
      donation.category ||
      donation.type ||
      "";

    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      foodType === "ALL" ||
      type.toUpperCase() === foodType;

    return matchesSearch && matchesType;
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-red-700">
          Unable to load donations
        </h2>

        <p className="text-red-600 mt-2">
          {error}
        </p>

        <button
          onClick={loadDonations}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Try Again
        </button>
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
          Available Donations
        </h1>

        <p className="text-gray-500 mt-2">
          Find available food donations and claim
          them for your NGO.
        </p>

      </div>

      {/* ======================================
          SEARCH + FILTER
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
              placeholder="Search donation..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* FILTER */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Type
            </label>

            <select
              value={foodType}
              onChange={(e) =>
                setFoodType(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">
                All Types
              </option>

              <option value="VEG">
                Veg
              </option>

              <option value="NON-VEG">
                Non-Veg
              </option>

              <option value="VEGAN">
                Vegan
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* ======================================
          RESULT COUNT
      ====================================== */}

      <div className="mb-5">

        <p className="text-gray-600">
          Showing{" "}
          <span className="font-bold">
            {filteredDonations.length}
          </span>{" "}
          donation
          {filteredDonations.length !== 1
            ? "s"
            : ""}
        </p>

      </div>

      {/* ======================================
          NO DONATIONS
      ====================================== */}

      {filteredDonations.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            🍱
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Donations Found
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no donations matching
            your search.
          </p>

        </div>

      ) : (

        /* ======================================
           DONATION GRID
        ====================================== */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredDonations.map((donation) => {

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

            const location =
              donation.pickupLocation ||
              donation.location ||
              donation.address ||
              "Location not specified";

            const expiry =
              donation.expiryDate ||
              donation.expiresAt ||
              donation.expiry;

            return (
              <div
                key={donationId}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >

                {/* CARD HEADER */}

                <div className="bg-green-50 p-5">

                  <div className="flex justify-between items-start gap-3">

                    <div>

                      <p className="text-xs font-semibold text-green-600 uppercase">
                        {foodType}
                      </p>

                      <h2 className="text-xl font-bold text-gray-800 mt-1">
                        {foodName}
                      </h2>

                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      AVAILABLE
                    </span>

                  </div>

                </div>

                {/* CARD BODY */}

                <div className="p-5 space-y-4">

                  {/* QUANTITY */}

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Quantity
                    </span>

                    <span className="font-semibold text-gray-800">
                      {quantity} {unit}
                    </span>

                  </div>

                  {/* LOCATION */}

                  <div>

                    <p className="text-gray-500 text-sm">
                      📍 Pickup Location
                    </p>

                    <p className="font-medium text-gray-800 mt-1">
                      {location}
                    </p>

                  </div>

                  {/* EXPIRY */}

                  <div>

                    <p className="text-gray-500 text-sm">
                      ⏰ Expiry
                    </p>

                    <p className="font-medium text-gray-800 mt-1">
                      {expiry
                        ? new Date(
                            expiry
                          ).toLocaleString()
                        : "Not specified"}
                    </p>

                  </div>

                  {/* VIEW */}

                  <Link
                    to={`/donation/${donationId}`}
                    className="block text-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default AvailableDonations;