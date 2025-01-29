// InstagramLogin.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InstagramLogin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    if (authCode) {
      console.log("Auth Code Retrieved from URL:", authCode);
      setLoading(true);

      // Call backend to exchange the code for an access token
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/auth/redirect`, {
          params: { code: authCode },
        })
        .then((response) => {
          console.log("Access Token Response:", response.data);
          const { access_token, user_id } = response.data;

          // Store the token in localStorage for future use
          localStorage.setItem('access_token', access_token);

          // Clear the URL query string after processing
          window.history.replaceState({}, document.title, window.location.pathname);

          // Navigate to the homepage or another route after successful login
          navigate('/');
        })
        .catch((error) => {
          console.error("Failed to get token:", error.response?.data || error.message);
          setError("Authentication failed. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No code parameter in URL.");
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div>
      <h2>Instagram Login Route Loaded!</h2>
       {loading && <div className="spinner">Loading...</div>}
       {error && <p>{error}</p>}
    </div>
 );
};

export default InstagramLogin;
