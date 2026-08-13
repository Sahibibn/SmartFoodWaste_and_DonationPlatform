import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getNGOById,
} from "../../api/api";

const NGODetails = () => {
  const { id } = useParams();

  const [ngo, setNgo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NGO
  // ==========================================

  const loadNGO = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getNGOById(id);

      const data =
        response.data?.ngo ||
        response.data?.data ||
        response.data;

      setNgo(data);

    } catch (err) {
      console.error(
        "Failed to load NGO:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to load NGO details";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadNGO();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading NGO details...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !ngo) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">

        <div className="text-5xl mb-4">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          NGO not found
        </h2>

        <p className="text-gray-500 mt-2">
          {error || "This NGO does not exist."}
        </p>

        <Link
          to="/ngos"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back to NGOs
        </Link>

      </div>
    );
  }

  const name =
    ngo?.name ||
    ngo?.organizationName ||
    "NGO";

  const city =
    ngo?.location?.city ||
    ngo?.city ||
    "Location unavailable";

  const description =
    ngo?.description ||
    "This organization is working to reduce food waste and support communities.";

  const address =
    ngo?.location?.address ||
    ngo?.address ||
    "";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ======================================
          BACK
      ====================================== */}

      <Link
        to="/ngos"
        className="inline-flex items-center text-green-600 font-semibold hover:underline"
      >
        ← Back to NGO Directory
      </Link>

      {/* ======================================
          PROFILE HEADER
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="bg-green-600 px-6 py-10">

          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-24 h-24 rounded-2xl bg-white text-green-600 flex items-center justify-center text-5xl shadow">
              🤝
            </div>

            <div className="text-white">

              <h1 className="text-3xl font-bold">
                {name}
              </h1>

              <p className="mt-2 text-green-100">
                📍 {city}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================
            INFORMATION
        ==================================== */}

        <div className="p-6">

          <h2 className="text-xl font-bold text-gray-800">
            About the Organization
          </h2>

          <p className="text-gray-600 mt-3 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

            {/* EMAIL */}

            {ngo?.email && (
              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Email
                </p>

                <p className="text-gray-700 mt-1">
                  📧 {ngo.email}
                </p>

              </div>
            )}

            {/* PHONE */}

            {ngo?.phone && (
              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Phone
                </p>

                <p className="text-gray-700 mt-1">
                  📞 {ngo.phone}
                </p>

              </div>
            )}

            {/* CITY */}

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-400 uppercase font-semibold">
                City
              </p>

              <p className="text-gray-700 mt-1">
                📍 {city}
              </p>

            </div>

            {/* ADDRESS */}

            {address && (
              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Address
                </p>

                <p className="text-gray-700 mt-1">
                  {address}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ======================================
          IMPACT
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">

          <div className="text-3xl">
            🍱
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {ngo?.donationsReceived ?? 0}
          </h3>

          <p className="text-sm text-gray-500">
            Donations Received
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">

          <div className="text-3xl">
            👥
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {ngo?.peopleSupported ?? 0}
          </h3>

          <p className="text-sm text-gray-500">
            People Supported
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">

          <div className="text-3xl">
            🌱
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {ngo?.impactScore ?? 0}
          </h3>

          <p className="text-sm text-gray-500">
            Impact Score
          </p>

        </div>

      </div>

    </div>
  );
};

export default NGODetails;