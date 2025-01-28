// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { initiateInstagramLogin } from '../api';

// const HeroSection = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is logged in (this is just a placeholder, replace with actual logic)
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleInstagramLogin = async () => {
//     try {
//       // Call your API to initiate Instagram login
//       await initiateInstagramLogin();  // Assuming you have the API logic in place
//     } catch (error) {
//       console.error('Failed to start Instagram login:', error.message);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-white">
//       <div className="container mx-auto px-4 text-center">
//         {/* Conditional header content based on login status */}
//         {isLoggedIn ? (
//           <>
//             <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
//               Welcome to Influex-App
//             </h1>
//             <p className="text-xl text-purple-800 mb-8 max-w-2xl mx-auto">
//             Unlock your potential with our innovative solutions designed to help you succeed and scale efficiently.
//             </p>
//           </>
          
//         ) : (
//           <>
//             <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
//               Automate Your Comments, Save Time, and Boost Engagement!
//             </h1>
//             <p className="text-xl text-purple-800 mb-8 max-w-2xl mx-auto">
//               Streamline your workflow with our automated commenting tool designed for busy professionals.
//             </p>
//           </>
//         )}

//         {/* Conditional UI rendering based on authentication state */}
//         {isLoggedIn ? (
//           <button
//             onClick={handleInstagramLogin}
//             className="text-white px-8 py-4 rounded-lg text-lg bg-purple-800 hover:bg-purple-900 transform hover:scale-105 transition-all"
//           >
//             Login with Instagram
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate('/auth/signup')}
//             className="text-white px-8 py-4 rounded-lg text-lg bg-purple-800 hover:bg-purple-900 transform hover:scale-105 transition-all"
//           >
//             Start Free Trial
//           </button>
//         )}

//         {/* Image preview section */}
//         <div className="mt-12">
//           <img
//             src="/preview.jpeg"
//             alt="Platform Preview"
//             className="rounded-lg shadow-xl mx-auto"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initiateInstagramAuth } from '../api';

const HeroSection = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [lambdaResponse, setLambdaResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInstagramAuth = () => {
    // Instagram OAuth URL (replace with your actual redirect URI and client ID)
    const clientId = 'YOUR_INSTAGRAM_CLIENT_ID';
    const redirectUri = encodeURIComponent('https://influex-airth.vercel.app/auth/redirect');  // Make sure your redirect URI is correctly set.
    const responseType = 'code'; // Instagram will return an auth code
    const scope = 'user_profile user_media'; // The scope of access you're requesting
  
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
    // Redirect to Instagram OAuth
    window.location.href = instagramAuthUrl;
  };
  

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const authCode = params.get('code');

  if (authCode) {
    console.log("Auth Code Retrieved from URL:", authCode);
    setLoading(true);

    // Call backend to exchange the code for an access token
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/redirect`, {
        params: { code: authCode },
      })
      .then((response) => {
        console.log("Access Token Response:", response.data);
        const { access_token, user_id } = response.data;
        setAccessToken(access_token);
        setUserId(user_id);

        // Optionally store the token for future use
        localStorage.setItem('access_token', access_token);

        // Clear the URL query string after processing
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch((error) => {
        console.error("Failed to get token:", error.response?.data || error.message);
        setError("Authentication failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, []);


  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
          Automate Your Comments, Save Time, and Boost Engagement!
        </h1>
        <p className="text-xl text-purple-800 mb-8 max-w-2xl mx-auto">
          Streamline your workflow with our automated commenting tool designed for busy professionals.
        </p>

        <button
          onClick={handleInstagramAuth}
          className="text-white px-8 py-4 rounded-lg text-lg bg-purple-800 hover:bg-purple-900 transform hover:scale-105 transition-all"
        >
          Start Free Trial
        </button>

        <div className="mt-12">
          <img
            src="/preview.jpeg"
            alt="Platform Preview"
            className="rounded-lg shadow-xl mx-auto"
          />
        </div>

        {loading && <p>Processing your authentication...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {accessToken && (
          <div>
            <h3>Authentication Successful</h3>
            <p>Your long-lived access token is ready!</p>
            <p>Lambda Response: {JSON.stringify(lambdaResponse)}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
