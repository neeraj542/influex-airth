import React from 'react';
const HeroSection = () => {

const handleStartFreeTrial = () => {
  // window.location.href = 'https://influex-airth-backend.vercel.app/auth/login';
  console.log(import.meta.env.VITE_API_BASE_URL);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  window.location.href = `${backendUrl}/auth/login`;
};

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
              Welcome to Influex-App
            </h1>
            <p className="text-xl text-purple-800 mb-8 max-w-2xl mx-auto">
            Unlock your potential with our innovative solutions designed to help you succeed and scale efficiently.
            </p>
          <button
            onClick={handleStartFreeTrial}
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
      </div>
    </section>
  );
};
export default HeroSection;
