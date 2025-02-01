import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ hideNavItems, isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Detects route changes
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference to the menu for detecting outside clicks

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login-user");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-purple-800 cursor-pointer"
          onClick={() => navigate("/", { replace: true })}
          aria-label="Go to homepage"
        >
          Influex 🌍
        </div>

        {/* Hamburger menu button for mobile */}
        <button
          className="md:hidden text-purple-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation Menu */}
        <nav
          ref={menuRef}
          className={`absolute left-0 top-full w-full bg-white shadow-md md:hidden flex flex-col items-center space-y-4 py-6 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden"
          }`}
          aria-label="Main navigation"
        >
          {!hideNavItems && (
            <>
              <Link to="#what-we-do" className="text-purple-900 hover:text-purple-700">
                What We Do
              </Link>
              <Link to="#features" className="text-purple-900 hover:text-purple-700">
                Features
              </Link>
              <Link to="#faq" className="text-purple-900 hover:text-purple-700">
                FAQ
              </Link>
              <Link to="#download" className="text-purple-900 hover:text-purple-700">
                Download
              </Link>
            </>
          )}

          {/* Buttons or Profile Icon for Mobile */}
          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-purple-800 hover:text-purple-700"
                aria-label="Go to profile"
              >
                <User className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 bg-purple-800 rounded-lg hover:bg-purple-900 flex items-center justify-center"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5 inline mr-2" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => navigate("/auth/login-user")}
                className="text-purple-800 hover:text-purple-700"
                aria-label="Go to login page"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="text-white px-6 py-2 bg-purple-800 rounded-lg hover:bg-purple-900"
                aria-label="Go to sign-up page"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          {!hideNavItems && (
            <>
              <Link to="#what-we-do" className="text-purple-900 hover:text-purple-700">
                What We Do
              </Link>
              <Link to="#features" className="text-purple-900 hover:text-purple-700">
                Features
              </Link>
              <Link to="#faq" className="text-purple-900 hover:text-purple-700">
                FAQ
              </Link>
              <Link to="#download" className="text-purple-900 hover:text-purple-700">
                Download
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Buttons */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/profile")}
              className="text-purple-800 hover:text-purple-700"
              aria-label="Go to profile"
            >
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 bg-purple-800 rounded-lg hover:bg-purple-900 flex items-center justify-center"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5 inline mr-2" /> Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/auth/login-user")}
              className="text-purple-800 hover:text-purple-700"
              aria-label="Go to login page"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
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
