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
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Simple client-side validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all fields.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      const { data } = await API.post("/auth/signup", formData);
      localStorage.setItem("token", data.token); // Store the token in localStorage
      navigate("/"); // Redirect to the homepage after successful registration
    } catch (err) {
      // Handle any errors from the API
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        
        {/* Name input */}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border mb-4 rounded-lg"
          required
        />
        
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border mb-4 rounded-lg"
          required
        />
        
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border mb-4 rounded-lg"
          required
        />
        
        {/* Register button */}
        <button
          type="submit"
          className="w-full py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
          disabled={loading} // Disable the button during loading
        >
          {loading ? "Registering..." : "SignUp"} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;