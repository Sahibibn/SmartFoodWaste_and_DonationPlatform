import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createNGO } from "../../api/api";

const NGOProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    registrationNumber: "",
    phone: "",
    address: "",
    description: "",
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
  // GET NGO LOCATION
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
          "NGO location detected successfully"
        );
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationLoading(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          toast.error(
            "Location permission was denied"
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          toast.error(
            "Location information unavailable"
          );
        } else if (
          error.code === error.TIMEOUT
        ) {
          toast.error(
            "Location request timed out"
          );
        } else {
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
  // VALIDATE
  // ==========================================

  const validateForm = () => {
    if (!formData.organizationName.trim()) {
      toast.error(
        "Please enter organization name"
      );
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter phone number");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error(
        "Please enter organization address"
      );
      return false;
    }

    if (
      !formData.latitude ||
      !formData.longitude
    ) {
      toast.error(
        "Please detect your NGO location"
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

      const ngoData = {
        organizationName:
          formData.organizationName.trim(),

        registrationNumber:
          formData.registrationNumber.trim(),

        phone: formData.phone.trim(),

        address: formData.address.trim(),

        description:
          formData.description.trim(),

        location: {
          latitude: Number(
            formData.latitude
          ),

          longitude: Number(
            formData.longitude
          ),
        },
      };

      console.log("NGO Data:", ngoData);

      await createNGO(ngoData);

      toast.success(
        "NGO profile created successfully!"
      );

      navigate("/ngo-dashboard");
    } catch (error) {
      console.error(
        "Create NGO error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create NGO profile"
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

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          NGO Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Register your NGO and help us connect
          you with nearby food donations.
        </p>

      </div>

      {/* FORM */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* NGO INFORMATION */}

          <div>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Organization Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* ORGANIZATION NAME */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="text"
                  name="organizationName"
                  value={
                    formData.organizationName
                  }
                  onChange={handleChange}
                  placeholder="e.g. Helping Hands Foundation"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* REGISTRATION NUMBER */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registrationNumber"
                  value={
                    formData.registrationNumber
                  }
                  onChange={handleChange}
                  placeholder="NGO registration number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Organization
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your NGO and the people you serve..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* LOCATION */}

          <div className="border-t border-gray-100 pt-8">

            <div className="bg-green-50 border border-green-100 rounded-xl p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    NGO Location
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your location will be used to
                    find nearby food donations.
                  </p>

                </div>

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
                  NGO Address
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter complete NGO address"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* COORDINATES */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>

                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    readOnly
                    placeholder="Click Use My Location"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>

                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    readOnly
                    placeholder="Click Use My Location"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none"
                  />

                </div>

              </div>

              {/* STATUS */}

              {formData.latitude &&
                formData.longitude && (
                  <div className="mt-4 bg-white border border-green-200 rounded-lg px-4 py-3">

                    <p className="text-sm font-semibold text-green-700">
                      ✓ Location detected
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formData.latitude},{" "}
                      {formData.longitude}
                    </p>

                  </div>
                )}

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={() =>
                navigate("/ngo-dashboard")
              }
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Saving Profile..."
                : "Save NGO Profile"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default NGOProfile;