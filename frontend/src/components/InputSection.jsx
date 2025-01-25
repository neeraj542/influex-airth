import React from 'react';

const InputSection = ({ navigate }) => (
    <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Tell Us About Your Needs</h2>
          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <select className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-700">
                <option className="text-gray-700 font-semibold">Select Platform</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Instagram</option>
              </select>
            </div>
            <div>
              <textarea
                placeholder="Comments/Feedback"
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              ></textarea>
            </div>
            <button 
              className="w-full text-white py-3 bg-purple-800 rounded-lg hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
);

export default InputSection;
