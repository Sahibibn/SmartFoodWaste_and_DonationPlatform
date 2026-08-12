import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  sendOTP,
  verifyOTP,
  signupUser,
} from "../../api/api";

const Signup = () => {
  const navigate = useNavigate();

  // ==========================================
  // STEP
  // ==========================================

  const [step, setStep] = useState(1);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    role: "DONOR",
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
  // STEP 1
  // SEND OTP
  // ==========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await sendOTP(formData.email);

      toast.success("OTP sent successfully");

      setStep(2);
    } catch (error) {
      console.error("Send OTP Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 2
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);

      await verifyOTP(
        formData.email,
        formData.otp
      );

      toast.success("Email verified successfully");

      setStep(3);
    } catch (error) {
      console.error("Verify OTP Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 3
  // SIGNUP
  // ==========================================

  const handleSignup = async (e) => {
    e.preventDefault();

    // Name validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    // Password validation
    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    // Confirm password
    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    // Password match
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    // Strong password
    if (
      formData.password.length < 8
    ) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      console.log(
        "Signup Response:",
        response.data
      );

      toast.success(
        "Account created successfully!"
      );

      // Redirect to login
      navigate("/login");

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-green-600">
            Smart Food Waste
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>

        </div>

        {/* ======================================
            PROGRESS INDICATOR
        ====================================== */}

        <div className="flex items-center justify-center mb-8">

          {/* STEP 1 */}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 1
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>

          {/* LINE */}

          <div
            className={`w-12 h-1 ${
              step >= 2
                ? "bg-green-600"
                : "bg-gray-200"
            }`}
          />

          {/* STEP 2 */}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 2
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>

          {/* LINE */}

          <div
            className={`w-12 h-1 ${
              step >= 3
                ? "bg-green-600"
                : "bg-gray-200"
            }`}
          />

          {/* STEP 3 */}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 3
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>

        </div>

        {/* ======================================
            STEP 1
            EMAIL
        ====================================== */}

        {step === 1 && (

          <form
            onSubmit={handleSendOTP}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>

        )}

        {/* ======================================
            STEP 2
            OTP
        ====================================== */}

        {step === 2 && (

          <form
            onSubmit={handleVerifyOTP}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-green-500"
              />

              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP sent to:
                <br />
                <span className="font-medium text-gray-700">
                  {formData.email}
                </span>
              </p>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  otp: "",
                }));

                setStep(1);
              }}
              className="w-full text-sm text-gray-500 hover:text-green-600"
            >
              Change Email
            </button>

          </form>

        )}

        {/* ======================================
            STEP 3
            ACCOUNT DETAILS
        ====================================== */}

        {step === 3 && (

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* ROLE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register As
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >

                <option value="DONOR">
                  Donor
                </option>

                <option value="NGO">
                  NGO
                </option>

              </select>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters with uppercase,
                lowercase, number and symbol.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

        )}

        {/* ======================================
            LOGIN LINK
        ====================================== */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Signup;