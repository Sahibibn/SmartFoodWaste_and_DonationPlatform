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

import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import ProtectedRoute from "./Components/ProtectedRoute";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/authSlice";


import DonorDonationDetails from "./Pages/Donor/DonationDetails";
import NGODonationDetails from "./Pages/Ngo/DonationDetails";


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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

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
            <ProtectedRoute allowedRoles={["DONOR"]}>
              <Layout>
                <DonorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-donation"
          element={
            <ProtectedRoute allowedRoles={["DONOR"]}>
              <Layout>
                <CreateDonation />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-donations"
          element={
            <ProtectedRoute allowedRoles={["DONOR"]}>
              <Layout>
                <MyDonations />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-donations/:id"
          element={
            <ProtectedRoute allowedRoles={["DONOR"]}>
              <Layout>
                <DonorDonationDetails />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* NGO */}

        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGODashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-donations"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <AvailableDonations />
              </Layout>
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/donation/:id"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGODonationDetails />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/claims"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <MyClaims />
              </Layout>
            </ProtectedRoute>
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

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>
    </>
  );
}

export default App;