import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const DonationCard = ({ donation, role = "DONOR" }) => {
  if (!donation) return null;

  const donationId =
    donation._id || donation.id;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">

      {/* ======================================
          IMAGE
      ====================================== */}

      {donation.image ? (
        <img
          src={donation.image}
          alt={donation.foodName}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-green-50 flex items-center justify-center text-5xl">
          🍱
        </div>
      )}

      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <h3 className="text-lg font-bold text-gray-800">
            {donation.foodName ||
              donation.title ||
              "Food Donation"}
          </h3>

          <StatusBadge
            status={donation.status}
          />

        </div>

        {/* DESCRIPTION */}

        {donation.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {donation.description}
          </p>
        )}

        {/* DETAILS */}

        <div className="mt-4 space-y-2 text-sm text-gray-600">

          {donation.quantity && (
            <p>
              <span className="font-semibold">
                Quantity:
              </span>{" "}
              {donation.quantity}
            </p>
          )}

          {donation.location && (
            <p>
              <span className="font-semibold">
                Location:
              </span>{" "}
              {typeof donation.location ===
              "object"
                ? donation.location.address ||
                  "Location available"
                : donation.location}
            </p>
          )}

          {donation.expiryDate && (
            <p>
              <span className="font-semibold">
                Expiry:
              </span>{" "}
              {new Date(
                donation.expiryDate
              ).toLocaleDateString()}
            </p>
          )}

        </div>

        {/* ======================================
            ACTION
        ====================================== */}

        {role === "DONOR" ? (
          <Link
            to={`/my-donations/${donationId}`}
            className="block w-full text-center mt-5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition"
          >
            View Details
          </Link>
        ) : (
          <Link
            to={`/donation/${donationId}`}
            className="block w-full text-center mt-5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition"
          >
            View Donation
          </Link>
        )}

      </div>

    </div>
  );
};

export default DonationCard;