// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Header from './components/layout/Header';
// import HeroSection from './components/HeroSection';
// import WhatWeDo from './components/WhatWeDo';
// import FAQForm from './pages/FAQForm';
// import FAQSection from './components/FAQSection';
// import InputSection from './components/InputSection';
// import DownloadSection from './components/DownloadSection';
// import Footer from './components/layout/Footer';
// import LoginPage from "./pages/auth/LoginPage";
// import SignupPage from "./pages/auth/SignupPage";
// import ProfilePage from "./pages/ProfilePage";

// /**
//  * Main App component that defines the structure and routing of the application.
//  *
//  * @returns {JSX.Element} The main application layout with navigation, content, and footer.
//  */
// const App = () => {
//   const navigate = useNavigate(); // Navigate programmatically between routes
//   const location = useLocation(); // Get the current route's location object

//   // Check if the user is logged in by looking for a token in localStorage
//   const isLoggedIn = Boolean(localStorage.getItem('token'));

//   /**
//    * Boolean to determine if the current page is the FAQ form page.
//    *
//    * @type {boolean}
//    */
//   const isFAQPage = location.pathname === '/faq-form';

//   // State for the token exchange and API response
//   const [accessToken, setAccessToken] = useState(null);
//   const [lambdaResponse, setLambdaResponse] = useState(null);

//   useEffect(() => {
//     // Check if there's an auth code in the URL
//     const params = new URLSearchParams(window.location.search);
//     const authCode = params.get('code');

//     if (authCode) {
//       console.log("Auth Code Retrieved from URL:", authCode);

//       // Step 1: Exchange auth code for short-lived token
//       axios
//         .get(`${import.meta.env.VITE_API_BASE_URL}/api/exchange-token`, {
//           params: { code: authCode },
//         })
//         .then((response) => {
//           console.log("Short-Lived Token Response:", response.data);

//           const shortLivedToken = response.data.access_token;

//           // Step 2: Exchange short-lived token for long-lived token and Lambda response
//           return axios.get(
//             `${import.meta.env.VITE_BACKEND_URL}/api/exchange-long-lived-token`,
//             {
//               params: { access_token: shortLivedToken },
//             }
//           );
//         })
//         .then((response) => {
//           console.log("Long-Lived Token Response:", response.data);

//           // Save the long-lived token and Lambda response
//           setAccessToken(response.data.longLivedToken.access_token);
//           setLambdaResponse(response.data.lambdaResponse);

//           // Optionally clear the URL after processing
//           window.history.replaceState({}, document.title, window.location.pathname);
//         })
//         .catch((error) => {
//           console.error("Failed to get token:", error.response?.data || error.message);
//         });
//     }
//   }, []); // Empty dependency array, runs only once after initial render

//   return (
//     <div className="min-h-screen font-sans">
//       {/* Header component with dynamic props based on the current route and login state */}
//       <Header 
//         navigate={navigate} 
//         hideNavItems={isFAQPage} 
//         isLoggedIn={isLoggedIn} // Pass the logged-in state to the header
//       />

//       <Routes>
//         {/* Route for the home page */}
//         <Route
//           path="/"
//           element={
//             !isFAQPage && (
//               <>
//                 {/* Home page sections */}
//                 <HeroSection navigate={navigate} />
//                 <WhatWeDo />
//                 <InputSection />
//                 <FAQSection />
//                 <DownloadSection />

//                 {/* Display the accessToken and lambdaResponse */}
//                 <div className="token-response-container">
//                   {accessToken && (
//                     <div className="token-box">
//                       <p><b>Access Token:</b> {accessToken}</p>
//                     </div>
//                   )}
//                   {lambdaResponse && (
//                     <div className="lambda-response-box">
//                       <p><b>Lambda Response:</b> {JSON.stringify(lambdaResponse)}</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )
//           }
//         />
//         <Route path="/auth/login-user" element={<LoginPage />} />
//         <Route path="/auth/signup" element={<SignupPage />}/>
//         <Route path="/faq-form" element={<FAQForm />} />
//         <Route path="/profile" element={<ProfilePage />}/>
//       </Routes>

//       {/* Footer component visible on all pages */}
//       <Footer />
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/HeroSection';
import WhatWeDo from './components/WhatWeDo';
import FAQForm from './pages/FAQForm';
import FAQSection from './components/FAQSection';
import InputSection from './components/InputSection';
import DownloadSection from './components/DownloadSection';
import Footer from './components/layout/Footer';
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const navigate = useNavigate(); // Navigate programmatically between routes
  const location = useLocation(); // Get the current route's location object

  // Check if the user is logged in by looking for a token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen font-sans">
      {/* Header component with dynamic props based on the current route and login state */}
      <Header
        navigate={navigate}
        hideNavItems={isFAQPage}
        isLoggedIn={isLoggedIn} // Pass the logged-in state to the header
      />

      <Routes>
        {/* Route for the home page */}
        <Route
          path="/"
          element={
            !isFAQPage && (
              <>
                {/* Home page sections */}
                <HeroSection navigate={navigate} />
                <WhatWeDo />
                <InputSection />
                <FAQSection />
                <DownloadSection />
              </>
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/auth/login-user" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/faq-form" element={<FAQForm />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      {/* Footer component visible on all pages */}
      <Footer />
    </div>
  );
};
export default App;
