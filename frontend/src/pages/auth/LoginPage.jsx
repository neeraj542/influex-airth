import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const { data } = await API.post("/auth/login-user", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/"); // Redirect to the homepage after login
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border mb-4 rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border mb-4 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
          disabled={loading} // Disable the button during loading
        >
          {loading ? "Logging in..." : "Login"} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
