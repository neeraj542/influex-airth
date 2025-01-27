import React from 'react';
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
import ProfilePage from "./pages/ProfilePage";

/**
 * Main App component that defines the structure and routing of the application.
 *
 * @returns {JSX.Element} The main application layout with navigation, content, and footer.
 */
const App = () => {
  const navigate = useNavigate(); // Navigate programmatically between routes
  const location = useLocation(); // Get the current route's location object

  // Check if the user is logged in by looking for a token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  /**
   * Boolean to determine if the current page is the FAQ form page.
   *
   * @type {boolean}
   */
  const isFAQPage = location.pathname === '/faq-form';

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
        <Route path="/auth/login-user" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />}/>
        <Route path="/faq-form" element={<FAQForm />} />
        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>

      {/* Footer component visible on all pages */}
      <Footer />
    </div>
  );
};

export default App;
