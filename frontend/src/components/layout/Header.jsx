/**
 * @fileoverview This file defines the `Header` React functional component that renders a fixed header with 
 * a logo, navigation links, and a login button. The component conditionally renders the navigation links 
 * based on the current page, and handles login redirection.
 */

import React from 'react';
import { useLocation } from 'react-router-dom'; // Import React Router's useLocation hook

/**
 * The `Header` component renders a fixed navigation header at the top of the page.
 * - The logo is clickable and redirects the user to the home page.
 * - Navigation items are conditionally displayed based on the current route.
 * - A "Sign Up Free" button redirects the user to a login page.
 *
 * @component
 * @example
 * return (
 *   <Header />
 * )
 *
 * @returns {JSX.Element} A React component rendering the header.
 */
const Header = () => {
  /**
   * The `location` object contains the current URL information (pathname, search, hash).
   * We use this to conditionally render navigation links based on the current route.
   * @type {Object}
   */
  const location = useLocation(); // Get the current route's location

  /**
   * Handles the login action by redirecting the user to the backend login URL.
   */
  const handleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    window.location.href = `${backendUrl}/auth/login`;
  };

  /**
   * Handles the logo click action by redirecting the user to the home page (`/`).
   */
  const handleLogoClick = () => {
    // Reload and navigate to home page (/)
    window.location.href = '/';
  };

  // Check if the current route is `faq-form`
  const isFaqPage = location.pathname === '/faq-form';

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo that redirects to home page */}
        <div className="text-2xl font-bold text-purple-800 cursor-pointer" onClick={handleLogoClick}>
          Influex 🌍
        </div>

        {/* Conditionally render the navigation items based on the current page */}
        {!isFaqPage && (
          <nav className="hidden md:flex space-x-6">
            <a href="#what-we-do" className="text-purple-900 hover:text-purple-700">What We Do</a>
            <a href="#features" className="text-purple-900 hover:text-purple-700">Features</a>
            <a href="#faq" className="text-purple-900 hover:text-purple-700">FAQ</a>
            <a href="#download" className="text-purple-900 hover:text-purple-700">Download</a>
          </nav>
        )}
        
        {/* Sign Up Free button */}
        <button onClick={handleLogin} className="text-white px-6 py-2 rounded-lg bg-purple-800 hover:bg-purple-900">
          Sign Up Free
        </button>
      </div>
    </header>
  );
};

export default Header;
