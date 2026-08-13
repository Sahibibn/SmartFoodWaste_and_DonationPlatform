import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getNGOs } from "../../api/api";

const NGODirectory = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNGOs, setFilteredNGOs] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NGOs
  // ==========================================

  const loadNGOs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNGOs();

      const data =
        response.data?.ngos ||
        response.data?.data ||
        response.data;

      const ngoList = Array.isArray(data)
        ? data
        : [];

      setNgos(ngoList);
      setFilteredNGOs(ngoList);

    } catch (err) {
      console.error(
        "Failed to load NGOs:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to load NGOs";

      setError(message);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadNGOs();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  useEffect(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      setFilteredNGOs(ngos);
      return;
    }

    const result = ngos.filter((ngo) => {

      const name =
        ngo?.name ||
        ngo?.organizationName ||
        "";

      const city =
        ngo?.location?.city ||
        ngo?.city ||
        "";

      const description =
        ngo?.description || "";

      return (
        name.toLowerCase().includes(value) ||
        city.toLowerCase().includes(value) ||
        description.toLowerCase().includes(value)
      );
    });

    setFilteredNGOs(result);

  }, [search, ngos]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading NGOs...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

        <div className="text-5xl mb-4">
          ⚠️
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          Unable to load NGOs
        </h2>

        <p className="text-gray-500 mt-2">
          {error}
        </p>

        <button
          onClick={loadNGOs}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          NGO Directory
        </h1>

        <p className="text-gray-500 mt-1">
          Find NGOs and organizations working to reduce food waste.
        </p>

      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search NGO by name, city or description..."
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />

        </div>

      </div>

      {/* ======================================
          RESULT COUNT
      ====================================== */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredNGOs.length}
          </span>{" "}
          NGO
          {filteredNGOs.length !== 1
            ? "s"
            : ""}
        </p>

        <button
          onClick={loadNGOs}
          className="text-sm text-green-600 font-semibold hover:underline"
        >
          ↻ Refresh
        </button>

      </div>

      {/* ======================================
          NO RESULTS
      ====================================== */}

      {filteredNGOs.length === 0 && (

        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">

          <div className="text-5xl mb-4">
            🤝
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            No NGOs found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search.
          </p>

        </div>

      )}

      {/* ======================================
          NGO GRID
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredNGOs.map((ngo) => {

          const name =
            ngo?.name ||
            ngo?.organizationName ||
            "NGO";

          const city =
            ngo?.location?.city ||
            ngo?.city ||
            "Location unavailable";

          const description =
            ngo?.description ||
            "Helping communities and reducing food waste.";

          return (
            <div
              key={ngo?._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >

              {/* CARD HEADER */}

              <div className="bg-green-50 p-6">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-xl bg-green-600 text-white flex items-center justify-center text-2xl">
                    🤝
                  </div>

                  <div className="min-w-0">

                    <h2 className="font-bold text-gray-800 text-lg truncate">
                      {name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      📍 {city}
                    </p>

                  </div>

                </div>

              </div>

              {/* CARD BODY */}

              <div className="p-6">

                <p className="text-sm text-gray-500 line-clamp-3">
                  {description}
                </p>

                {/* DETAILS */}

                <div className="mt-5 space-y-3">

                  {ngo?.email && (
                    <div className="flex gap-3 text-sm text-gray-600">
                      <span>📧</span>
                      <span className="truncate">
                        {ngo.email}
                      </span>
                    </div>
                  )}

                  {ngo?.phone && (
                    <div className="flex gap-3 text-sm text-gray-600">
                      <span>📞</span>
                      <span>
                        {ngo.phone}
                      </span>
                    </div>
                  )}

                </div>

                {/* VIEW BUTTON */}

                {ngo?._id && (
                  <Link
                    to={`/ngos/${ngo._id}`}
                    className="block text-center mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    View NGO
                  </Link>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default NGODirectory;
