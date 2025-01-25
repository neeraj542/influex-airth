import React from 'react';

const ResponsePreferences = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'tone' || name === 'commentTypes') {
      setFormData({
        ...formData,
        responsePreferences: {
          ...formData.responsePreferences,
          [name]: checked
            ? [...formData.responsePreferences[name], value]
            : formData.responsePreferences[name].filter((item) => item !== value),
        },
      });
    } else {
      setFormData({
        ...formData,
        responsePreferences: {
          ...formData.responsePreferences,
          [name]: value,
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tone of Responses</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tone" value="Friendly" onChange={handleChange} />
            Friendly
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tone" value="Professional" onChange={handleChange} />
            Professional
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tone" value="Casual" onChange={handleChange} />
            Casual
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tone" value="Other" onChange={handleChange} />
            Other
          </label>
          <input
            type="text"
            name="toneOther"
            value={formData.responsePreferences.toneOther}
            onChange={handleChange}
            className="border border-neutral-300 p-3 rounded-md"
            placeholder="Specify"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Common Types of Comments You Receive</label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="commentTypes" value="Product/service inquiries" onChange={handleChange} />
            Product/service inquiries
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="commentTypes" value="Compliments" onChange={handleChange} />
            Compliments
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="commentTypes" value="Complaints or negative feedback" onChange={handleChange} />
            Complaints or negative feedback
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="commentTypes" value="Spam or irrelevant comments" onChange={handleChange} />
            Spam or irrelevant comments
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="commentTypes" value="Others" onChange={handleChange} />
            Others
          </label>
          <input
            type="text"
            name="commentTypesOther"
            value={formData.responsePreferences.commentTypesOther}
            onChange={handleChange}
            className="border border-neutral-300 p-3 rounded-md"
            placeholder="Specify"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Response Time Expectations</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="responseTime" value="Within 1 hour" onChange={handleChange} />
            Within 1 hour
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="responseTime" value="Within 3 hours" onChange={handleChange} />
            Within 3 hours
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="responseTime" value="Within 6 hours" onChange={handleChange} />
            Within 6 hours
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="responseTime" value="Other" onChange={handleChange} />
            Other
          </label>
          <input
            type="text"
            name="responseTimeOther"
            value={formData.responsePreferences.responseTimeOther}
            onChange={handleChange}
            className="border border-neutral-300 p-3 rounded-md"
            placeholder="Specify"
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsePreferences;