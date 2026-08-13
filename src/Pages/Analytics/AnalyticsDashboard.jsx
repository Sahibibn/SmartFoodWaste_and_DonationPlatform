import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAnalytics,
} from "../../api/api";

const AnalyticsDashboard = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnalytics();

      setAnalytics(response.data);

    } catch (err) {
      console.error(
        "Failed to load analytics:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to load analytics";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading analytics...
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
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

        <div className="text-5xl mb-4">
          ⚠️
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          Unable to load analytics
        </h2>

        <p className="text-gray-500 mt-2">
          {error}
        </p>

        <button
          onClick={loadAnalytics}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Try Again
        </button>

      </div>
    );
  }

  // ==========================================
  // SAFE DATA
  // ==========================================

  const data = analytics || {};

  const totalDonations =
    data.totalDonations ??
    data.donations ??
    0;

  const activeDonations =
    data.activeDonations ??
    data.availableDonations ??
    0;

  const claimedDonations =
    data.claimedDonations ??
    data.claims ??
    0;

  const completedDonations =
    data.completedDonations ??
    data.completed ??
    0;

  const totalUsers =
    data.totalUsers ??
    data.users ??
    0;

  const totalNGOs =
    data.totalNGOs ??
    data.ngos ??
    0;

  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
    description,
  }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {value}
            </h2>

            {description && (
              <p className="text-xs text-gray-400 mt-2">
                {description}
              </p>
            )}

          </div>

          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
            {icon}
          </div>

        </div>

      </div>
    );
  };

  // ==========================================
  // DONATION STATUS
  // ==========================================

  const statusData = [
    {
      label: "Available",
      value: activeDonations,
      icon: "🟢",
    },
    {
      label: "Claimed",
      value: claimedDonations,
      icon: "🟡",
    },
    {
      label: "Completed",
      value: completedDonations,
      icon: "🔵",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor food donations and platform activity.
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          ↻ Refresh
        </button>

      </div>

      {/* ======================================
          MAIN STATS
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <StatCard
          title="Total Donations"
          value={totalDonations}
          icon="🍱"
          description="All food donations"
        />

        <StatCard
          title="Available Donations"
          value={activeDonations}
          icon="📦"
          description="Currently available"
        />

        <StatCard
          title="Claimed Donations"
          value={claimedDonations}
          icon="🤝"
          description="Donations claimed by NGOs"
        />

        <StatCard
          title="Completed Donations"
          value={completedDonations}
          icon="✅"
          description="Successfully completed"
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          icon="👥"
          description="Registered users"
        />

        <StatCard
          title="Registered NGOs"
          value={totalNGOs}
          icon="🏢"
          description="Partner NGOs"
        />

      </div>

      {/* ======================================
          DONATION STATUS
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Donation Status
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current distribution of donations
            </p>

          </div>

        </div>

        <div className="space-y-5">

          {statusData.map((item) => {

            const percentage =
              totalDonations > 0
                ? Math.round(
                    (item.value /
                      totalDonations) *
                      100
                  )
                : 0;

            return (
              <div key={item.label}>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <span>
                      {item.icon}
                    </span>

                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-700">
                    {item.value}
                  </span>

                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">

                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {percentage}% of total donations
                </p>

              </div>
            );
          })}

        </div>

      </div>

      {/* ======================================
          IMPACT SECTION
      ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FOOD IMPACT */}

        <div className="bg-green-600 text-white rounded-2xl p-7">

          <div className="text-4xl mb-4">
            🌱
          </div>

          <h2 className="text-2xl font-bold">
            Food Waste Impact
          </h2>

          <p className="text-green-100 mt-2">
            Every successful donation helps reduce
            food waste and supports people in need.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="bg-white/10 rounded-xl p-4">

              <p className="text-3xl font-bold">
                {completedDonations}
              </p>

              <p className="text-sm text-green-100">
                Successful Donations
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <p className="text-3xl font-bold">
                {totalNGOs}
              </p>

              <p className="text-sm text-green-100">
                NGO Partners
              </p>

            </div>

          </div>

        </div>

        {/* PLATFORM SUMMARY */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">

          <h2 className="text-xl font-bold text-gray-800">
            Platform Summary
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Current Smart Food Waste activity
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between border-b pb-4">

              <span className="text-gray-600">
                Total Donations
              </span>

              <span className="font-bold text-gray-800">
                {totalDonations}
              </span>

            </div>

            <div className="flex items-center justify-between border-b pb-4">

              <span className="text-gray-600">
                Active Donations
              </span>

              <span className="font-bold text-green-600">
                {activeDonations}
              </span>

            </div>

            <div className="flex items-center justify-between border-b pb-4">

              <span className="text-gray-600">
                Claims
              </span>

              <span className="font-bold text-yellow-600">
                {claimedDonations}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-gray-600">
                Completed
              </span>

              <span className="font-bold text-blue-600">
                {completedDonations}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;