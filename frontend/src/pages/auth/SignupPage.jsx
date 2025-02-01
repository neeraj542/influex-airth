import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/auth/signup", formData);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        {/* Name input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Register button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-all focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Already have an account */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-purple-800 hover:underline cursor-pointer"
            onClick={() => navigate("/auth/login-user")}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
