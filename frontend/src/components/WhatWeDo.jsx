/**
 * @fileoverview This file defines the `WhatWeDo` React functional component that displays 
 * a section highlighting key features of a service or product.
 */

import React from 'react';

/**
 * Represents a single feature with a title and description.
 * @typedef {Object} Feature
 * @property {string} title - The title of the feature.
 * @property {string} description - A brief description of the feature.
 */

/**
 * The `WhatWeDo` component renders a section that highlights features of a product or service.
 * It uses a grid layout to display feature cards with titles and descriptions.
 *
 * @component
 * @example
 * return (
 *   <WhatWeDo />
 * )
 *
 * @returns {JSX.Element} A React component rendering the "What We Do" section.
 */
const WhatWeDo = () => {
  /**
   * A list of features to display in the "What We Do" section.
   * @type {Feature[]}
   */
  const features = [
    {
      title: "Automate Responses",
      description: "Save time by automating responses across multiple platforms simultaneously."
    },
    {
      title: "Save Hours",
      description: "Eliminate repetitive tasks and focus on what matters most to your business."
    },
    {
      title: "Boost Engagement",
      description: "Increase your online presence with personalized, timely interactions."
    }
  ];

  return (
    <section id="what-we-do" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border-t-4 hover:scale-105 transition-all cursor-pointer"
              style={{ borderColor: 'rgba(106, 17, 89, 0.8)' }}
            >
              <h3 className="text-xl font-bold mb-4 text-purple-900">{feature.title}</h3>
              <p className="text-purple-800">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
