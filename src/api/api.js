import axios from "axios";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

// =====================================================
// AUTHENTICATION APIs
// =====================================================

// -----------------------------------------------------
// Send OTP
// POST /api/auth/send-otp
// -----------------------------------------------------

export const sendOTP = (email) => {
  return API.post("/auth/send-otp", {
    email,
  });
};

// -----------------------------------------------------
// Verify OTP
// POST /api/auth/verify-otp
// -----------------------------------------------------

export const verifyOTP = (email, otp) => {
  return API.post("/auth/verify-otp", {
    email,
    otp,
  });
};

// -----------------------------------------------------
// Signup
// POST /api/auth/signup
// -----------------------------------------------------

export const signupUser = (data) => {
  return API.post("/auth/signup", data);
};

// -----------------------------------------------------
// Login
// POST /api/auth/login
// -----------------------------------------------------

export const login = (data) => {
  return API.post("/auth/login", data);
};

// -----------------------------------------------------
// Logout
// POST /api/auth/logout
// -----------------------------------------------------

export const logout = () => {
  return API.post("/auth/logout");
};

// -----------------------------------------------------
// Get Current User
// GET /api/auth/me
// -----------------------------------------------------

export const getCurrentUser = () => {
  return API.get("/auth/me");
};


// =====================================================
// DONATION APIs
// =====================================================

// -----------------------------------------------------
// Create Donation
// POST /api/donations
// -----------------------------------------------------

export const createDonation = (data) => {
  return API.post("/donations", data);
};

// -----------------------------------------------------
// Get My Donations
// GET /api/donations/my
// -----------------------------------------------------

export const getMyDonations = () => {
  return API.get("/donations/my");
};

// -----------------------------------------------------
// Get Available Donations
// GET /api/donations/available
// -----------------------------------------------------

export const getAvailableDonations = async() => {
  return API.get("/donations/available");
};

// -----------------------------------------------------
// Get Single Donation
// GET /api/donations/:id
// -----------------------------------------------------

export const getDonationById = async(id) => {
  return API.get(`/donations/${id}`);
};

// Update donation status
export const updateDonationStatus = (id, status) =>
  API.patch(`/donations/${id}/status`, {
    status,
  });


// -----------------------------------------------------
// Delete Donation
// DELETE /api/donations/:id
// -----------------------------------------------------

export const deleteDonation = (id) => {
  return API.delete(`/donations/${id}`);
};


// =====================================================
// CLAIM APIs
// =====================================================

// -----------------------------------------------------
// Claim Donation
// POST /api/claims
// -----------------------------------------------------

export const claimDonation = async(donationId) => {
  return API.post("/claims", {
    donationId,
  });
};

// -----------------------------------------------------
// Get My Claims
// GET /api/claims/my
// -----------------------------------------------------

export const getMyClaims = async() => {
  return API.get("/claims/my");
};

// Update claim status
export const updateClaimStatus = (id, status) =>
  API.patch(`/claims/${id}/status`, {
    status,
  });

// -----------------------------------------------------
// Get Claim By ID
// GET /api/claims/:id
// -----------------------------------------------------

export const getClaimById = async(id) => {
  return API.get(`/claims/${id}`);
};


// =====================================================
// NGO APIs
// =====================================================

// -----------------------------------------------------
// Get All NGOs
// GET /api/ngos
// -----------------------------------------------------

export const getNGOs = () => {
  return API.get("/ngos");
};


// ==========================================
// NEARBY NGO MATCHING
// ==========================================

export const getNearbyNGOs = (
  donationId,
  radius = 50
) =>
  API.get(
    `/ngos/nearby?donationId=${donationId}&radius=${radius}`
  );

// -----------------------------------------------------
// Get NGO By ID
// GET /api/ngos/:id
// -----------------------------------------------------

export const getNGOById = (id) => {
  return API.get(`/ngos/${id}`);
};


// =====================================================
// DONOR PROFILE APIs
// =====================================================

// -----------------------------------------------------
// Create Donor Profile
// POST /api/donors
// -----------------------------------------------------

export const createDonor = (data) => {
  return API.post("/donors", data);
};

// -----------------------------------------------------
// Get All Donors
// GET /api/donors
// -----------------------------------------------------

export const getDonors = () => {
  return API.get("/donors");
};

// -----------------------------------------------------
// Get Donor By ID
// GET /api/donors/:id
// -----------------------------------------------------

export const getDonorById = (id) => {
  return API.get(`/donors/${id}`);
};


// =====================================================
// ANALYTICS APIs
// =====================================================

// -----------------------------------------------------
// Get Analytics
// GET /api/analytics
// -----------------------------------------------------

export const getAnalytics = () => {
  return API.get("/analytics");
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default API;