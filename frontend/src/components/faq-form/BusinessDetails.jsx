import React from 'react';

const BusinessDetails = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="Enter your business name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Industry/Niche</label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="e.g., Fitness, Beauty, Technology, Education, etc."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Handles</label>
        <input
          type="text"
          name="socialMedia"
          value={formData.socialMedia}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="Provide links to your Instagram profile and other platforms if applicable"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
        <textarea
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="Describe your typical customers. e.g., age group, location, interests"
        ></textarea>
      </div>
    </div>
  );
};

export default BusinessDetails;