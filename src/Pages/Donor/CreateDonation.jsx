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
    expiryDate: "",
    pickupLocation: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by your browser"
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));

        toast.success(
          "Location detected successfully"
        );
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        if (error.code === 1) {
          toast.error(
            "Please allow location permission"
          );
        } else {
          toast.error(
            "Unable to detect your location"
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
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.foodName.trim()) {
      toast.error("Please enter food name");
      return false;
    }

    if (!formData.foodType.trim()) {
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

    if (!formData.pickupLocation.trim()) {
      toast.error(
        "Please enter pickup location"
      );
      return false;
    }

    if (
      formData.latitude === "" ||
      formData.longitude === ""
    ) {
      toast.error(
        "Please detect your pickup location"
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const donationData = {
        foodName: formData.foodName.trim(),

        foodType: formData.foodType,

        quantity: Number(formData.quantity),

        unit: formData.unit,

        expiryDate: formData.expiryDate,

        pickupLocation:
          formData.pickupLocation.trim(),

        description:
          formData.description.trim(),

        latitude: Number(
          formData.latitude
        ),

        longitude: Number(
          formData.longitude
        ),
      };

      console.log(
        "Creating donation:",
        donationData
      );

      await createDonation(donationData);

      toast.success(
        "Donation created successfully!"
      );

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
          Share surplus food with people who
          need it.
        </p>

      </div>

      {/* ======================================
          FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6"
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
                Food Name *
              </label>

              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Cooked Rice"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* FOOD TYPE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type *
              </label>

              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >

                <option value="">
                  Select food type
                </option>

                <option value="Cooked Food">
                  Cooked Food
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

                <option value="Packaged Food">
                  Packaged Food
                </option>

                <option value="Grains">
                  Grains
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
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="e.g. 20"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >

                <option value="kg">
                  Kilograms
                </option>

                <option value="liters">
                  Liters
                </option>

                <option value="pieces">
                  Pieces
                </option>

                <option value="packets">
                  Packets
                </option>

                <option value="boxes">
                  Boxes
                </option>

              </select>

            </div>

            {/* EXPIRY */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date & Time *
              </label>

              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                min={new Date()
                  .toISOString()
                  .slice(0, 16)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

          </div>

        </div>

        {/* ====================================
            LOCATION
        ==================================== */}

        <div className="border-t pt-6">

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Pickup Location
          </h2>

          <p className="text-sm text-gray-500 mb-5">
            Your location helps us recommend the
            donation to nearby NGOs.
          </p>

          {/* LOCATION NAME */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Address / Location *
            </label>

            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="e.g. Connaught Place, New Delhi"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* LOCATION BUTTON */}

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>

                <h3 className="font-semibold text-gray-800">
                  📍 Detect Your Location
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Allow browser location access to
                  automatically capture coordinates.
                </p>

              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold whitespace-nowrap"
              >
                Detect Location
              </button>

            </div>

            {/* COORDINATES */}

            {(formData.latitude ||
              formData.longitude) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                <div className="bg-white rounded-lg p-3 border border-green-200">

                  <p className="text-xs text-gray-500">
                    Latitude
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {formData.latitude}
                  </p>

                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200">

                  <p className="text-xs text-gray-500">
                    Longitude
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {formData.longitude}
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <div className="border-t pt-6">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Additional Information
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Add details about the food, preparation time, packaging, etc."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

        </div>

        {/* ====================================
            ACTIONS
        ==================================== */}

        <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading
              ? "Creating Donation..."
              : "Create Donation"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateDonation;