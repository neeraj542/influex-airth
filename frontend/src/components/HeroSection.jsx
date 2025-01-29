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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInstagramAuth = async () => {
    setLoading(true);
    try {
      // Redirect the user to the backend to initiate Instagram login
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
    } catch (error) {
      console.error("Error during Instagram authentication:", error);
      setLoading(false);
    }
  };

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

        {loading && <p>Loading...</p>}
      </div>
    </section>
  );
};

export default HeroSection;
