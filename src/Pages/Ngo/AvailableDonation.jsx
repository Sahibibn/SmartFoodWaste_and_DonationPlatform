import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getAvailableDonations } from "../../api/api";

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);

  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("ALL");
  const [location, setLocation] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DONATIONS
  // ==========================================

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAvailableDonations();

      const data =
        response.data?.donations ||
        response.data?.data ||
        response.data;

      setDonations(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load donations:",
        err
      );

      const message =
        err.response?.data?.message ||
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
  // FOOD TYPES
  // ==========================================

  const foodTypes = useMemo(() => {
    const types = donations
      .map(
        (donation) =>
          donation?.foodType ||
          donation?.category ||
          donation?.type
      )
      .filter(Boolean);

    return ["ALL", ...new Set(types)];
  }, [donations]);

  // ==========================================
  // GET EXPIRY DATE
  // ==========================================

  const getExpiryDate = (donation) => {
    return (
      donation?.expiryDate ||
      donation?.expiresAt ||
      donation?.expiry ||
      null
    );
  };

  // ==========================================
  // DAYS UNTIL EXPIRY
  // ==========================================

  const getDaysUntilExpiry = (donation) => {
    const expiry = getExpiryDate(donation);

    if (!expiry) return null;

    const expiryTime =
      new Date(expiry).getTime();

    const now = new Date().getTime();

    const difference =
      expiryTime - now;

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  };

  // ==========================================
  // FILTER DONATIONS
  // ==========================================

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const name =
        donation?.foodName ||
        donation?.name ||
        donation?.title ||
        "";

      const type =
        donation?.foodType ||
        donation?.category ||
        donation?.type ||
        "";

      const donationLocation =
        donation?.location?.city ||
        donation?.location?.address ||
        donation?.city ||
        donation?.address ||
        "";

      // SEARCH
      const matchesSearch =
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        type
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        donationLocation
          .toLowerCase()
          .includes(search.toLowerCase());

      // FOOD TYPE
      const matchesFoodType =
        foodType === "ALL" ||
        type === foodType;

      // LOCATION
      const matchesLocation =
        !location.trim() ||
        donationLocation
          .toLowerCase()
          .includes(
            location.toLowerCase()
          );

      // EXPIRY
      const days =
        getDaysUntilExpiry(donation);

      let matchesExpiry = true;

      if (expiryFilter === "TODAY") {
        matchesExpiry =
          days !== null &&
          days <= 1;
      }

      if (expiryFilter === "3_DAYS") {
        matchesExpiry =
          days !== null &&
          days <= 3;
      }

      if (expiryFilter === "7_DAYS") {
        matchesExpiry =
          days !== null &&
          days <= 7;
      }

      if (expiryFilter === "SAFE") {
        matchesExpiry =
          days !== null &&
          days > 7;
      }

      return (
        matchesSearch &&
        matchesFoodType &&
        matchesLocation &&
        matchesExpiry
      );
    });
  }, [
    donations,
    search,
    foodType,
    location,
    expiryFilter,
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setFoodType("ALL");
    setLocation("");
    setExpiryFilter("ALL");
  };

  // ==========================================
  // EXPIRY BADGE
  // ==========================================

  const getExpiryBadge = (donation) => {
    const days =
      getDaysUntilExpiry(donation);

    if (days === null) {
      return {
        text: "Expiry unavailable",
        className:
          "bg-gray-100 text-gray-600",
      };
    }

    if (days <= 0) {
      return {
        text: "Expired",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (days <= 1) {
      return {
        text: "Expires today",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (days <= 3) {
      return {
        text: `${days} days left`,
        className:
          "bg-orange-100 text-orange-700",
      };
    }

    if (days <= 7) {
      return {
        text: `${days} days left`,
        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: `${days} days left`,
      className:
        "bg-green-100 text-green-700",
    };
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading available donations...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">

        <div className="text-5xl">
          ⚠️
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          Failed to load donations
        </h2>

        <p className="text-gray-500 mt-2">
          {error}
        </p>

        <button
          onClick={loadDonations}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Available Donations
          </h1>

          <p className="text-gray-500 mt-1">
            Find food donations available for your NGO.
          </p>

        </div>

        <button
          onClick={loadDonations}
          className="border border-green-600 text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg font-semibold"
        >
          ↻ Refresh
        </button>

      </div>

      {/* ======================================
          FILTER PANEL
      ====================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="font-bold text-gray-800">
              Search & Filters
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Find the most suitable food donations.
            </p>

          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* SEARCH */}

          <div className="xl:col-span-2">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search food, type or location..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

          </div>

          {/* FOOD TYPE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Type
            </label>

            <select
              value={foodType}
              onChange={(e) =>
                setFoodType(e.target.value)
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >

              {foodTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type === "ALL"
                    ? "All Food Types"
                    : type}
                </option>
              ))}

            </select>

          </div>

          {/* EXPIRY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry
            </label>

            <select
              value={expiryFilter}
              onChange={(e) =>
                setExpiryFilter(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >

              <option value="ALL">
                Any Expiry
              </option>

              <option value="TODAY">
                Expires Today
              </option>

              <option value="3_DAYS">
                Within 3 Days
              </option>

              <option value="7_DAYS">
                Within 7 Days
              </option>

              <option value="SAFE">
                More Than 7 Days
              </option>

            </select>

          </div>

          {/* LOCATION */}

          <div className="md:col-span-2 xl:col-span-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Enter city or location..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

        </div>

      </div>

      {/* ======================================
          RESULTS
      ====================================== */}

      <div className="flex items-center justify-between">

        <p className="text-gray-600">

          <span className="font-bold text-gray-800">
            {filteredDonations.length}
          </span>{" "}
          donation
          {filteredDonations.length !== 1
            ? "s"
            : ""}{" "}
          found

        </p>

      </div>

      {/* ======================================
          EMPTY
      ====================================== */}

      {filteredDonations.length === 0 && (

        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">

          <div className="text-6xl">
            🍱
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-4">
            No donations found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Clear Filters
          </button>

        </div>

      )}

      {/* ======================================
          DONATION GRID
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredDonations.map((donation) => {

          const foodName =
            donation?.foodName ||
            donation?.name ||
            donation?.title ||
            "Food Donation";

          const type =
            donation?.foodType ||
            donation?.category ||
            donation?.type ||
            "Food";

          const quantity =
            donation?.quantity ??
            donation?.amount ??
            "N/A";

          const unit =
            donation?.unit ||
            "items";

          const donationLocation =
            donation?.location?.city ||
            donation?.location?.address ||
            donation?.city ||
            donation?.address ||
            "Location unavailable";

          const expiry =
            getExpiryBadge(donation);

          return (
            <div
              key={donation?._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >

              {/* CARD TOP */}

              <div className="bg-green-50 p-6">

                <div className="flex justify-between gap-3">

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      {foodName}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {type}
                    </p>

                  </div>

                  <span
                    className={`h-fit px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${expiry.className}`}
                  >
                    {expiry.text}
                  </span>

                </div>

              </div>

              {/* CARD BODY */}

              <div className="p-6 space-y-4">

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

                <div className="flex gap-3">

                  <span>
                    📍
                  </span>

                  <div>

                    <p className="text-xs text-gray-400 uppercase font-semibold">
                      Location
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {donationLocation}
                    </p>

                  </div>

                </div>

                {/* DONOR */}

                {(donation?.donor?.name ||
                  donation?.donorName) && (

                  <div className="flex gap-3">

                    <span>
                      👤
                    </span>

                    <div>

                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Donor
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        {donation?.donor?.name ||
                          donation?.donorName}
                      </p>

                    </div>

                  </div>

                )}

                {/* BUTTON */}

                {donation?._id && (

                  <Link
                    to={`/donation/${donation._id}`}
                    className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    View Donation
                  </Link>

                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default AvailableDonations;