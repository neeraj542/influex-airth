import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react'; // Icons for user profile and logout
import { Link } from 'react-router-dom';

/**
 * The `Header` component renders a fixed navigation header at the top of the page.
 * - The logo is clickable and redirects the user to the home page.
 * - Navigation items are conditionally displayed based on the current route.
 * - The header displays Sign In/Sign Up buttons or the User Profile icon based on authentication status.
 *
 * @component
 * @example
 * return (
 *   <Header />
 * )
 *
 * @returns {JSX.Element} A React component rendering the header.
 */
const Header = ({ navigate, hideNavItems, isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout by clearing the token and redirecting to login
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the stored token
    navigate('/auth/login-user'); // Redirect to the login page
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo that redirects to home page */}
        <div 
          className="text-2xl font-bold text-purple-800 cursor-pointer" 
          onClick={() => navigate('/', { replace: true })} 
          aria-label="Go to homepage"
        >
          Influex 🌍
        </div>

        {/* Hamburger menu button for mobile */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {/* Conditionally render the navigation items */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:flex space-x-6`} aria-label="Main navigation">
          {/* Only display navigation items if hideNavItems is false */}
          {!hideNavItems && (
            <>
              <Link to="#what-we-do" replace className="text-purple-900 hover:text-purple-700">What We Do</Link>
              <Link to="#features"  replace className="text-purple-900 hover:text-purple-700">Features</Link>
              <Link to="#faq" replace className="text-purple-900 hover:text-purple-700">FAQ</Link>
              <Link to="#download" replace className="text-purple-900 hover:text-purple-700">Download</Link>
            </>
          )}
        </nav>

        {/* Conditionally render buttons or profile icon */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* User Profile Icon */}
            <button
              onClick={() => navigate('/profile', { replace: true })} // Redirect to user profile page
              className="text-purple-800 hover:text-purple-700"
              aria-label="Go to profile"
            >
              <User className="h-6 w-6" />
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 bg-purple-800 rounded-lg hover:bg-purple-900"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5 inline mr-2" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Sign In Button */}
            <button
              onClick={() => navigate('/auth/login-user', { replace: true })}
              className="text-purple-800 hover:text-purple-700"
              aria-label="Go to login page"
            >
              Sign In
            </button>

            {/* Sign Up Button */}
            <button
              onClick={() => navigate('/auth/signup', { replace: true })}
              className="text-white px-6 py-2 bg-purple-800 rounded-lg hover:bg-purple-900"
              aria-label="Go to sign-up page"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;