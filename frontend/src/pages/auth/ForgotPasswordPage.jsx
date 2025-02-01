import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api"; // Import the forgotPassword method

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const data = await forgotPassword(email); // Call the forgotPassword method
      setSuccessMessage("A reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <form
        onSubmit={handleForgotPassword}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 text-sm bg-green-100 p-3 rounded-md mb-4">{successMessage}</p>
        )}

        {/* Email input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Reset Password button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-all focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>

        {/* Back to login link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Remembered your password?{" "}
          <span
            className="text-purple-800 hover:underline cursor-pointer"
            onClick={() => navigate("/auth/login-user")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
