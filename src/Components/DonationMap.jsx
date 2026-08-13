import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

// ==========================================
// FIX LEAFLET DEFAULT ICON
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ==========================================
// MAP CENTER COMPONENT
// ==========================================

const MapCenter = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      map.setView(
        [latitude, longitude],
        13
      );
    }
  }, [latitude, longitude, map]);

  return null;
};

// ==========================================
// DONATION MAP
// ==========================================

const DonationMap = ({
  donation,
  ngos = [],
}) => {
  const donationLatitude = Number(
    donation?.location?.latitude
  );

  const donationLongitude = Number(
    donation?.location?.longitude
  );

  // ==========================================
  // CHECK LOCATION
  // ==========================================

  if (
    !Number.isFinite(donationLatitude) ||
    !Number.isFinite(donationLongitude)
  ) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Donation Location
        </h2>

        <p className="text-gray-500 mt-3">
          Donation location is not available.
        </p>

      </div>
    );
  }

  // ==========================================
  // NGO LOCATION
  // ==========================================

  const validNGOs = ngos.filter((ngo) => {
    const lat = Number(
      ngo?.location?.latitude ??
        ngo?.latitude
    );

    const lng = Number(
      ngo?.location?.longitude ??
        ngo?.longitude
    );

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* HEADER */}

      <div className="p-6 border-b border-gray-100">

        <h2 className="text-xl font-bold text-gray-800">
          Donation Location
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Nearby donation and NGO locations
        </p>

      </div>

      {/* MAP */}

      <div className="h-[450px] w-full">

        <MapContainer
          center={[
            donationLatitude,
            donationLongitude,
          ]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >

          {/* OPEN STREET MAP */}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* CENTER */}

          <MapCenter
            latitude={donationLatitude}
            longitude={donationLongitude}
          />

          {/* DONATION MARKER */}

          <Marker
            position={[
              donationLatitude,
              donationLongitude,
            ]}
          >

            <Popup>

              <div className="text-center">

                <div className="text-xl">
                  🍱
                </div>

                <strong>
                  Food Donation
                </strong>

                <p className="text-sm text-gray-500 mt-1">
                  {donation?.title ||
                    donation?.foodName ||
                    "Available Food"}
                </p>

              </div>

            </Popup>

          </Marker>

          {/* NGO MARKERS */}

          {validNGOs.map((ngo, index) => {

            const latitude = Number(
              ngo?.location?.latitude ??
                ngo?.latitude
            );

            const longitude = Number(
              ngo?.location?.longitude ??
                ngo?.longitude
            );

            const name =
              ngo?.organizationName ||
              ngo?.name ||
              ngo?.ngoName ||
              "NGO";

            return (
              <Marker
                key={
                  ngo?._id || index
                }
                position={[
                  latitude,
                  longitude,
                ]}
              >

                <Popup>

                  <div>

                    <div className="text-xl">
                      🏢
                    </div>

                    <strong>
                      {name}
                    </strong>

                    <p className="text-sm text-gray-500 mt-1">
                      {ngo?.address ||
                        ngo?.location?.address ||
                        "Address unavailable"}
                    </p>

                    {ngo?.distance !==
                      undefined && (
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        {Number(
                          ngo.distance
                        ).toFixed(1)}{" "}
                        km away
                      </p>
                    )}

                  </div>

                </Popup>

              </Marker>
            );
          })}

        </MapContainer>

      </div>

      {/* LEGEND */}

      <div className="p-4 border-t border-gray-100 flex flex-wrap gap-5 text-sm">

        <div className="flex items-center gap-2">

          <span className="text-lg">
            🍱
          </span>

          <span className="text-gray-600">
            Donation
          </span>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-lg">
            🏢
          </span>

          <span className="text-gray-600">
            NGO
          </span>

        </div>

      </div>

    </div>
  );
};

export default DonationMap;