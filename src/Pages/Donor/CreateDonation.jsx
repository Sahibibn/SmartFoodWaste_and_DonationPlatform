import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createDonation } from "../../api/api";

const CreateDonation = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    unit: "kg",
    description: "",
    expiryDate: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // GET CURRENT LOCATION
  // ==========================================

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by your browser"
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setLocationLoading(false);

        toast.success(
          "Location detected successfully"
        );
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location permission was denied"
            );
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Location information is unavailable"
            );
            break;

          case error.TIMEOUT:
            toast.error(
              "Location request timed out"
            );
            break;

          default:
            toast.error(
              "Unable to detect location"
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!formData.foodName.trim()) {
      toast.error("Please enter food name");
      return false;
    }

    if (!formData.foodType) {
      toast.error("Please select food type");
      return false;
    }

    if (!formData.quantity) {
      toast.error("Please enter quantity");
      return false;
    }

    if (Number(formData.quantity) <= 0) {
      toast.error(
        "Quantity must be greater than 0"
      );
      return false;
    }

    if (!formData.expiryDate) {
      toast.error(
        "Please select expiry date"
      );
      return false;
    }

    if (!formData.address.trim()) {
      toast.error(
        "Please enter pickup address"
      );
      return false;
    }

    if (
      !formData.latitude ||
      !formData.longitude
    ) {
      toast.error(
        "Please detect your location before creating the donation"
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // SUBMIT DONATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // DONATION PAYLOAD
      // ======================================

      const donationData = {
        foodName: formData.foodName.trim(),

        foodType: formData.foodType,

        quantity: Number(formData.quantity),

        unit: formData.unit,

        description:
          formData.description.trim(),

        expiryDate: formData.expiryDate,

        location: {
          address: formData.address.trim(),

          latitude: Number(
            formData.latitude
          ),

          longitude: Number(
            formData.longitude
          ),
        },
      };

      console.log(
        "Donation Data:",
        donationData
      );

      await createDonation(donationData);

      toast.success(
        "Donation created successfully!"
      );

      // ======================================
      // REDIRECT
      // ======================================

      navigate("/my-donations");

    } catch (error) {
      console.error(
        "Create donation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create donation"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MINIMUM EXPIRY DATE
  // ==========================================

  const getMinDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-4xl mx-auto">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Create Donation
        </h1>

        <p className="text-gray-500 mt-2">
          Share your surplus food with people
          who need it.
        </p>

      </div>

      {/* ======================================
          FORM CARD
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ====================================
              FOOD INFORMATION
          ==================================== */}

          <div>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Food Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* FOOD NAME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Rice, Biryani, Bread"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />

              </div>

              {/* FOOD TYPE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >

                  <option value="">
                    Select food type
                  </option>

                  <option value="Cooked Food">
                    Cooked Food
                  </option>

                  <option value="Raw Food">
                    Raw Food
                  </option>

                  <option value="Packaged Food">
                    Packaged Food
                  </option>

                  <option value="Fruits">
                    Fruits
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Dairy">
                    Dairy
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* QUANTITY */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 20"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />

              </div>

              {/* UNIT */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >

                  <option value="kg">
                    Kilograms (kg)
                  </option>

                  <option value="grams">
                    Grams
                  </option>

                  <option value="liters">
                    Liters
                  </option>

                  <option value="packets">
                    Packets
                  </option>

                  <option value="pieces">
                    Pieces
                  </option>

                  <option value="boxes">
                    Boxes
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* ====================================
              DESCRIPTION
          ==================================== */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the food, condition, packaging, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

          </div>

          {/* ====================================
              EXPIRY
          ==================================== */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Expiry Date & Time
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={getMinDateTime()}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Please provide an accurate expiry
              time so NGOs can prioritize urgent
              donations.
            </p>

          </div>

          {/* ====================================
              LOCATION
          ==================================== */}

          <div className="border-t border-gray-100 pt-8">

            <div className="bg-green-50 border border-green-100 rounded-xl p-5">

              {/* LOCATION HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Donation Location
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your location helps NGOs find
                    and collect this donation.
                  </p>

                </div>

                {/* LOCATION BUTTON */}

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-3 rounded-lg font-semibold transition whitespace-nowrap"
                >
                  {locationLoading
                    ? "📍 Detecting..."
                    : "📍 Use My Location"}
                </button>

              </div>

              {/* ADDRESS */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter the complete pickup address"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* COORDINATES */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                {/* LATITUDE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>

                  <input
                    type="text"
                    name="latitude"
                    value={
                      formData.latitude
                    }
                    onChange={handleChange}
                    placeholder="Click Use My Location"
                    readOnly
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none"
                  />

                </div>

                {/* LONGITUDE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>

                  <input
                    type="text"
                    name="longitude"
                    value={
                      formData.longitude
                    }
                    onChange={handleChange}
                    placeholder="Click Use My Location"
                    readOnly
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none"
                  />

                </div>

              </div>

              {/* LOCATION STATUS */}

              {formData.latitude &&
                formData.longitude && (
                  <div className="mt-4 bg-white border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">

                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-green-700">
                        Location detected
                      </p>

                      <p className="text-xs text-gray-500">
                        {formData.latitude},{" "}
                        {formData.longitude}
                      </p>

                    </div>

                  </div>
                )}

            </div>

          </div>

          {/* ====================================
              INFO BOX
          ==================================== */}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

            <div className="flex gap-3">

              <div className="text-xl">
                💡
              </div>

              <div>

                <h3 className="font-semibold text-blue-800">
                  Why do we need your location?
                </h3>

                <p className="text-sm text-blue-700 mt-1">
                  Your location allows Smart Food
                  Waste to recommend nearby NGOs
                  and helps them collect your
                  donation efficiently.
                </p>

              </div>

            </div>

          </div>

          {/* ====================================
              ACTION BUTTONS
          ==================================== */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={() =>
                navigate("/my-donations")
              }
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Creating Donation..."
                : "Create Donation"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateDonation;