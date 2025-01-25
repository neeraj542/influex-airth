import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/HeroSection';
import WhatWeDo from './components/WhatWeDo';
import FAQForm from './pages/FAQForm';
import FAQSection from './components/FAQSection'
import InputSection from './components/InputSection';
import DownloadSection from './components/DownloadSection';
import Footer from './components/layout/Footer';

/**
 * Main App component that defines the structure and routing of the application.
 *
 * @returns {JSX.Element} The main application layout with navigation, content, and footer.
 */
const App = () => {
  const navigate = useNavigate(); // Navigate programmatically between routes
  const location = useLocation(); // Get the current route's location object

  /**
   * Boolean to determine if the current page is the FAQ form page.
   *
   * @type {boolean}
   */
  const isFAQPage = location.pathname === '/faq-form';

  return (
    <div className="min-h-screen font-sans">
      {/* Header component with dynamic props based on the current route */}
      <Header navigate={navigate} hideNavItems={isFAQPage} />

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
                <FAQSection/>
                <DownloadSection />
              </>
            )
          }
        />
        {/* Route for the FAQ form */}
        <Route path="/faq-form" element={<FAQForm />} />
      </Routes>

      {/* Footer component visible on all pages */}
      <Footer />
    </div>
  );
};

export default App;
