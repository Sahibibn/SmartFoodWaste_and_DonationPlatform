import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { getAnalytics } from "../../api/api";

const AnalyticsDashboard = () => {
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

      console.log(
        "Analytics response:",
        response.data
      );

      const data =
        response.data?.analytics ||
        response.data?.data ||
        response.data;

      setAnalytics(data);

    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to load analytics";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

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
      <div className="max-w-3xl mx-auto py-20">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-red-700">
            Unable to load analytics
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // SAFE VALUES
  // ==========================================

  const totalDonations =
    analytics?.totalDonations ??
    analytics?.donations ??
    0;

  const availableDonations =
    analytics?.availableDonations ??
    analytics?.available ??
    0;

  const claimedDonations =
    analytics?.claimedDonations ??
    analytics?.claimed ??
    0;

  const completedDonations =
    analytics?.completedDonations ??
    analytics?.completed ??
    0;

  const totalNGOs =
    analytics?.totalNGOs ??
    analytics?.ngos ??
    0;

  const totalDonors =
    analytics?.totalDonors ??
    analytics?.donors ??
    0;

  const totalClaims =
    analytics?.totalClaims ??
    analytics?.claims ??
    0;

  // ==========================================
  // PIE DATA
  // ==========================================

  const donationStatusData = [
    {
      name: "Available",
      value: availableDonations,
    },
    {
      name: "Claimed",
      value: claimedDonations,
    },
    {
      name: "Completed",
      value: completedDonations,
    },
  ].filter((item) => item.value > 0);

  // ==========================================
  // BAR DATA
  // ==========================================

  const overviewData = [
    {
      name: "Donations",
      value: totalDonations,
    },
    {
      name: "Claims",
      value: totalClaims,
    },
    {
      name: "NGOs",
      value: totalNGOs,
    },
    {
      name: "Donors",
      value: totalDonors,
    },
  ];

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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-gray-500 text-sm font-medium">
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

          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
            {icon}
          </div>

        </div>

      </div>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor food donations, NGOs and
            food waste reduction.
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          Refresh Data
        </button>

      </div>

      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Donations"
          value={totalDonations}
          icon="🍱"
          description="All food donations"
        />

        <StatCard
          title="Available"
          value={availableDonations}
          icon="🥗"
          description="Waiting for NGOs"
        />

        <StatCard
          title="Claimed"
          value={claimedDonations}
          icon="🤝"
          description="Currently claimed"
        />

        <StatCard
          title="Completed"
          value={completedDonations}
          icon="✅"
          description="Successfully delivered"
        />

      </div>

      {/* ======================================
          USERS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <StatCard
          title="Total Donors"
          value={totalDonors}
          icon="👨‍🍳"
        />

        <StatCard
          title="Total NGOs"
          value={totalNGOs}
          icon="🏢"
        />

        <StatCard
          title="Total Claims"
          value={totalClaims}
          icon="📦"
        />

      </div>

      {/* ======================================
          CHARTS
      ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* BAR CHART */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Platform Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overall Smart Food Waste activity
          </p>

          <div className="h-80 mt-6">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={overviewData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* PIE CHART */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Donation Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current donation distribution
          </p>

          <div className="h-80 mt-6">

            {donationStatusData.length === 0 ? (

              <div className="h-full flex items-center justify-center text-gray-400">
                No donation data available
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={donationStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {donationStatusData.map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

      </div>

      {/* ======================================
          SUCCESS RATE
      ====================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Donation Success Rate
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Percentage of donations successfully
          completed.
        </p>

        <div className="mt-6">

          <div className="flex justify-between mb-2">

            <span className="text-sm font-medium text-gray-600">
              Completion Rate
            </span>

            <span className="text-sm font-bold text-green-600">

              {totalDonations > 0
                ? Math.round(
                    (completedDonations /
                      totalDonations) *
                      100
                  )
                : 0}
              %

            </span>

          </div>

          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-600 rounded-full transition-all"
              style={{
                width: `${
                  totalDonations > 0
                    ? Math.min(
                        (completedDonations /
                          totalDonations) *
                          100,
                        100
                      )
                    : 0
                }%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;