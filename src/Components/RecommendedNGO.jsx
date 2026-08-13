import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getNGOs,
  getDonationById,
} from "../api/api";

const RecommendedNGO = ({ donationId }) => {
  const [ngos, setNgos] = useState([]);
  const [donation, setDonation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // HAVERSINE DISTANCE
  // ==========================================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const earthRadius = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(
        (lat1 * Math.PI) / 180
      ) *
        Math.cos(
          (lat2 * Math.PI) / 180
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  // ==========================================
  // GET NGO COORDINATES
  // ==========================================

  const getNGOLocation = (ngo) => {
    const latitude =
      ngo?.location?.latitude ??
      ngo?.latitude;

    const longitude =
      ngo?.location?.longitude ??
      ngo?.longitude;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return null;
    }

    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  };

  // ==========================================
  // LOAD RECOMMENDATIONS
  // ==========================================

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!donationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get donation
        const donationResponse =
          await getDonationById(donationId);

        const donationData =
          donationResponse.data?.donation ||
          donationResponse.data;

        setDonation(donationData);

        // Donation location
        const donationLat = Number(
          donationData?.location?.latitude
        );

        const donationLng = Number(
          donationData?.location?.longitude
        );

        if (
          !Number.isFinite(donationLat) ||
          !Number.isFinite(donationLng)
        ) {
          setError(
            "Donation location is not available."
          );

          setLoading(false);
          return;
        }

        // Get NGOs
        const ngoResponse =
          await getNGOs();

        const ngoData =
          ngoResponse.data?.ngos ||
          ngoResponse.data;

        if (!Array.isArray(ngoData)) {
          setError(
            "Unable to load NGOs."
          );

          setLoading(false);
          return;
        }

        // Calculate distance
        const nearbyNGOs = ngoData
          .map((ngo) => {
            const location =
              getNGOLocation(ngo);

            if (!location) {
              return null;
            }

            const distance =
              calculateDistance(
                donationLat,
                donationLng,
                location.latitude,
                location.longitude
              );

            return {
              ...ngo,
              distance,
            };
          })
          .filter(Boolean)
          .sort(
            (a, b) =>
              a.distance - b.distance
          )
          .slice(0, 5);

        setNgos(nearbyNGOs);

      } catch (err) {
        console.error(
          "Recommendation error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load recommended NGOs"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [donationId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended NGOs
        </h2>

        <div className="mt-5 space-y-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse flex gap-4"
            >

              <div className="w-12 h-12 bg-gray-200 rounded-full" />

              <div className="flex-1">

                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />

                <div className="h-3 bg-gray-200 rounded w-3/4" />

              </div>

            </div>
          ))}

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended NGOs
        </h2>

        <p className="text-sm text-red-500 mt-3">
          {error}
        </p>

      </div>
    );
  }

  // ==========================================
  // NO NGO
  // ==========================================

  if (ngos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended NGOs
        </h2>

        <div className="mt-5 text-center py-8">

          <div className="text-4xl mb-3">
            🏢
          </div>

          <p className="text-gray-600 font-medium">
            No nearby NGOs found
          </p>

          <p className="text-sm text-gray-400 mt-1">
            More NGOs may become available
            soon.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // NGO CARD
  // ==========================================

  const getNGOName = (ngo) => {
    return (
      ngo.organizationName ||
      ngo.name ||
      ngo.ngoName ||
      "NGO"
    );
  };

  const getNGOAddress = (ngo) => {
    return (
      ngo.address ||
      ngo.location?.address ||
      "Address not available"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-bold text-gray-800">
            Recommended NGOs
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            NGOs nearest to this donation
          </p>

        </div>

        <div className="text-2xl">
          🎯
        </div>

      </div>

      {/* NGO LIST */}

      <div className="space-y-4">

        {ngos.map((ngo, index) => (

          <div
            key={ngo._id || index}
            className={`border rounded-xl p-4 transition hover:shadow-md ${
              index === 0
                ? "border-green-300 bg-green-50"
                : "border-gray-200"
            }`}
          >

            <div className="flex gap-4">

              {/* ICON */}

              <div className="w-12 h-12 shrink-0 bg-green-100 rounded-full flex items-center justify-center text-xl">
                🏢
              </div>

              {/* INFO */}

              <div className="flex-1 min-w-0">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <div className="flex items-center gap-2">

                    <h3 className="font-bold text-gray-800">
                      {getNGOName(ngo)}
                    </h3>

                    {index === 0 && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Best Match
                      </span>
                    )}

                  </div>

                  <span className="text-sm font-semibold text-green-600">
                    {ngo.distance.toFixed(1)} km
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-2">
                  📍 {getNGOAddress(ngo)}
                </p>

                {ngo.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {ngo.phone}
                  </p>
                )}

                {/* DISTANCE BAR */}

                <div className="mt-3">

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${Math.max(
                          10,
                          Math.min(
                            100,
                            100 -
                              ngo.distance *
                                5
                          )
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* FOOTER */}

      <div className="mt-5 pt-4 border-t border-gray-100">

        <p className="text-xs text-gray-400">
          Recommendations are based on the
          distance between the donation and NGO
          locations.
        </p>

      </div>

    </div>
  );
};

export default RecommendedNGO;