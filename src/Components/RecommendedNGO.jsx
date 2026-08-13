import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getNearbyNGOs } from "../api/api";

const RecommendedNGO = ({
  donationId,
}) => {
  const [ngos, setNgos] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD NEARBY NGOS
  // ==========================================

  const loadNearbyNGOs = async () => {
    if (!donationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getNearbyNGOs(
          donationId,
          50
        );

      const data =
        response.data?.ngos ||
        response.data?.data ||
        [];

      setNgos(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Nearby NGO error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to find nearby NGOs";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyNGOs();
  }, [donationId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recommended NGOs
        </h2>

        <div className="flex items-center gap-3 text-gray-500">

          <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />

          Finding nearby NGOs...

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended NGOs
        </h2>

        <p className="text-red-600 mt-2">
          {error}
        </p>

      </div>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (ngos.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended NGOs
        </h2>

        <p className="text-gray-500 mt-2">
          No nearby NGOs found within 50 km.
        </p>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold text-gray-800">
            Recommended NGOs
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Sorted by distance from the donation.
          </p>

        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          {ngos.length} found
        </span>

      </div>

      <div className="space-y-4">

        {ngos.map((ngo, index) => {

          const ngoId =
            ngo._id ||
            ngo.id;

          return (
            <div
              key={ngoId}
              className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-3">

                  {/* RANK */}

                  <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800">
                      {ngo.name ||
                        "NGO"}
                    </h3>

                    {ngo.address && (
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {ngo.address}
                      </p>
                    )}

                    {ngo.email && (
                      <p className="text-sm text-gray-500 mt-1">
                        ✉️ {ngo.email}
                      </p>
                    )}

                  </div>

                </div>

                {/* DISTANCE */}

                <div className="text-right shrink-0">

                  <p className="text-lg font-bold text-green-600">
                    {ngo.distance} km
                  </p>

                  <p className="text-xs text-gray-500">
                    away
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default RecommendedNGO;