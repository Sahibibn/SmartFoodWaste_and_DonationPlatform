import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createDonation } from "../../api/api";

const CreateDonation = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    pickupAddress: "",
  });

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
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter food title");
      return;
    }

    if (!formData.foodType) {
      toast.error("Please select food type");
      return;
    }

    if (!formData.quantity) {
      toast.error("Please enter quantity");
      return;
    }

    if (!formData.expiryDate) {
      toast.error("Please select expiry date");
      return;
    }

    if (!formData.pickupAddress.trim()) {
      toast.error("Please enter pickup address");
      return;
    }

    try {
      setLoading(true);

      const response = await createDonation({
        title: formData.title.trim(),
        description: formData.description.trim(),
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        pickupAddress:
          formData.pickupAddress.trim(),
      });

      console.log(
        "Donation created:",
        response.data
      );

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

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Create Donation
        </h1>

        <p className="text-gray-500 mt-2">
          Add details about the surplus food
          you want to donate.
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
      >

        {/* TITLE */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Food Title *
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Fresh cooked rice"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        {/* DESCRIPTION */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the food..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

        </div>

        {/* FOOD TYPE */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
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

            <option value="COOKED">
              Cooked Food
            </option>

            <option value="PACKAGED">
              Packaged Food
            </option>

            <option value="FRUITS">
              Fruits
            </option>

            <option value="VEGETABLES">
              Vegetables
            </option>

            <option value="BAKERY">
              Bakery
            </option>

            <option value="DAIRY">
              Dairy
            </option>

            <option value="OTHER">
              Other
            </option>

          </select>

        </div>

        {/* QUANTITY */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity *
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="Example: 20"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unit
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >

              <option value="kg">Kilograms</option>
              <option value="liters">Liters</option>
              <option value="packets">Packets</option>
              <option value="plates">Plates</option>
              <option value="pieces">Pieces</option>

            </select>

          </div>

        </div>

        {/* EXPIRY */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
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

        {/* ADDRESS */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pickup Address *
          </label>

          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            rows="3"
            placeholder="Enter the address where NGO can collect the food"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

        </div>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create Donation"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateDonation;