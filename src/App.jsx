import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";

// =====================================================
// ANALYTICS
// =====================================================

import AnalyticsDashboard from "./Pages/Analytics/AnalyticsDashboard";

// =====================================================
// DONOR PAGES
// =====================================================

import DonorDashboard from "./Pages/Donor/DonorDashBoard";
import CreateDonation from "./Pages/Donor/CreateDonation";
import MyDonations from "./Pages/Donor/MyDonation";

// =====================================================
// NGO PAGES
// =====================================================

import NGODashboard from "./Pages/Ngo/NGODashboard";
import AvailableDonations from "./Pages/Ngo/AvailableDonation";
import MyClaims from "./Pages/Ngo/MyClaims";


// =====================================================
// LAYOUT
// =====================================================

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* DONOR */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <DonorDashboard />
            </Layout>
          }
        />

        <Route
          path="/create-donation"
          element={
            <Layout>
              <CreateDonation />
            </Layout>
          }
        />

        <Route
          path="/my-donations"
          element={
            <Layout>
              <MyDonations />
            </Layout>
          }
        />


        {/* NGO */}

        <Route
          path="/ngo-dashboard"
          element={
            <Layout>
              <NGODashboard />
            </Layout>
          }
        />

        <Route
          path="/available-donations"
          element={
            <Layout>
              <AvailableDonations />
            </Layout>
          }
        />

        <Route
          path="/claims"
          element={
            <Layout>
              <MyClaims />
            </Layout>
          }
        />


        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={
            <Layout>
              <AnalyticsDashboard />
            </Layout>
          }
        />


        {/* NGOs */}

        <Route
          path="/ngos"
          element={
            <Layout>

              <div>

                <h1 className="text-3xl font-bold text-gray-800">
                  NGOs
                </h1>

                <p className="text-gray-500 mt-2">
                  NGO directory coming soon.
                </p>

              </div>

            </Layout>
          }
        />


        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}

export default App;