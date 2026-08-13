import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DonationMap = ({
  donations = [],
  center = [28.6139, 77.209],
  zoom = 10,
}) => {
  // ==========================================
  // GET VALID DONATIONS
  // ==========================================

  const validDonations = donations.filter(
    (donation) => {
      const lat =
        donation.latitude ??
        donation.lat ??
        donation.location?.coordinates?.[1];

      const lng =
        donation.longitude ??
        donation.lng ??
        donation.lon ??
        donation.location?.coordinates?.[0];

      return (
        typeof lat === "number" &&
        typeof lng === "number"
      );
    }
  );

  // ==========================================
  // MAP
  // ==========================================

  return (
    <div className="w-full h-125 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validDonations.map((donation) => {

          const latitude =
            donation.latitude ??
            donation.lat ??
            donation.location?.coordinates?.[1];

          const longitude =
            donation.longitude ??
            donation.lng ??
            donation.lon ??
            donation.location?.coordinates?.[0];

          const donationId =
            donation._id ||
            donation.id;

          const foodName =
            donation.foodName ||
            donation.title ||
            donation.name ||
            "Food Donation";

          const location =
            donation.pickupLocation ||
            donation.address ||
            donation.locationName ||
            "Location not specified";

          return (
            <Marker
              key={donationId}
              position={[
                latitude,
                longitude,
              ]}
            >

              <Popup>

                <div className="min-w-45">

                  <h3 className="font-bold text-lg">
                    {foodName}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    📍 {location}
                  </p>

                  {donation.quantity && (
                    <p className="mt-1">
                      Quantity:{" "}
                      <strong>
                        {donation.quantity}
                        {donation.unit
                          ? ` ${donation.unit}`
                          : ""}
                      </strong>
                    </p>
                  )}

                  {donation.expiryDate && (
                    <p className="mt-1">
                      Expiry:{" "}
                      {new Date(
                        donation.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                </div>

              </Popup>

            </Marker>
          );
        })}

      </MapContainer>

    </div>
  );
};

export default DonationMap;