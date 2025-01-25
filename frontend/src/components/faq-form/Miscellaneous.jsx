import React from 'react';

const Miscellaneous = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      miscellaneous: {
        ...formData.miscellaneous,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Products to Highlight</label>
        <input
          type="text"
          name="productsToHighlight"
          value={formData.miscellaneous.productsToHighlight}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="e.g., Mobile, Laptop"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
        <input
          type="text"
          name="specialOffers"
          value={formData.miscellaneous.specialOffers}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="e.g., 10% or 20% discount"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Languages for Comment Replies:</label>
        <input
          type="text"
          name="languages"
          value={formData.miscellaneous.languages}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="e.g., English, Hindi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords to Flag for Immediate Attention:</label>
        <input
          type="text"
          name="flaggedKeywords"
          value={formData.miscellaneous.flaggedKeywords}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="e.g., refund, scam, help"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes or Customization Requests: </label>
        <textarea
          name="additionalNotes"
          value={formData.miscellaneous.additionalNotes}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="Enter any other preferences or instructions"
        ></textarea>
      </div>
    </div>
  );
};

export default Miscellaneous;