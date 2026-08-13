import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";

// ==========================================
// FIX LEAFLET DEFAULT MARKER ICON
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

const MapCenter = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
};

// ==========================================
// DONATION MAP
// ==========================================

const DonationMap = ({
  latitude,
  longitude,
  donation,
  height = "400px",
}) => {
  // ========================================
  // VALIDATE LOCATION
  // ========================================

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return (
      <div
        className="w-full bg-gray-100 rounded-xl flex items-center justify-center text-center p-8"
        style={{ height }}
      >
        <div>
          <div className="text-4xl mb-3">
            📍
          </div>

          <h3 className="font-semibold text-gray-700">
            Location unavailable
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            This donation does not have valid coordinates.
          </p>
        </div>
      </div>
    );
  }

  const position = [lat, lng];

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-gray-200"
      style={{ height }}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        {/* MAP TILES */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* CENTER MAP */}

        <MapCenter position={position} />

        {/* DONATION MARKER */}

        <Marker position={position}>

          <Popup>

            <div className="min-w-45">

              <h3 className="font-bold text-gray-800">
                {donation?.foodName ||
                  donation?.name ||
                  "Food Donation"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {donation?.foodType ||
                  donation?.category ||
                  "Food"}
              </p>

              <p className="text-sm mt-2">
                📍 Donation Location
              </p>

            </div>

          </Popup>

        </Marker>

      </MapContainer>
    </div>
  );
};

export default DonationMap;