import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import API from "../../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.post("/auth/login-user", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/"); // Redirect to the home page
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        {/* Email input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            required
          />
          <div
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-all focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot password link */}
        <div className="text-center mt-4">
          <span
            className="text-purple-800 hover:underline cursor-pointer"
            onClick={() => navigate("/auth/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        {/* Signup link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-purple-800 hover:underline cursor-pointer"
            onClick={() => navigate("/auth/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
