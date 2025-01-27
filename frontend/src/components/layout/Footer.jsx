/**
 * @fileoverview This file defines the `Footer` React functional component, which renders a footer section
 * containing navigation links, social media icons, and a newsletter subscription form.
 */

import React from 'react';
import { Twitter, Linkedin, Mail } from 'lucide-react';

/**
 * The `Footer` component renders a footer section with the following features:
 * - Navigation links for pages like About Us, Privacy Policy, and Terms of Service.
 * - Social media icons linking to external platforms.
 * - A newsletter subscription form with an email input and a subscribe button.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 *
 * @returns {JSX.Element} A React component rendering the footer section.
 */
const Footer = () => (
  <footer className="bg-purple-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Branding and Navigation Links */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Influex 🌍</h1>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-200">About Us</a></li>
            <li><a href="#" className="hover:text-purple-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-200">Terms of Service</a></li>
            <li><a href="#" className="hover:text-purple-200">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Social</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-purple-200"><Twitter /></a>
            <a href="#" className="hover:text-purple-200"><Linkedin /></a>
            <a href="#" className="hover:text-purple-200"><Mail /></a>
          </div>
        </div>

        {/* Newsletter Subscription Form */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold mb-4">Newsletter</h3>
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg text-purple-900"
              aria-label="Email input for newsletter subscription"
            />
            <button
              className="mt-2 sm:mt-0 sm:px-6 py-2 rounded-r-lg bg-purple-800 hover:bg-purple-900 transform hover:scale-105 transition-all"
              aria-label="Subscribe button"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
