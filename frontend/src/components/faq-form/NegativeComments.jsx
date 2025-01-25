import React from 'react';

const NegativeComments = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'approach') {
      setFormData({
        ...formData,
        negativeComments: {
          ...formData.negativeComments,
          [name]: checked
            ? [...formData.negativeComments[name], value]
            : formData.negativeComments[name].filter((item) => item !== value),
        },
      });
    } else {
      setFormData({
        ...formData,
        negativeComments: {
          ...formData.negativeComments,
          [name]: value,
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Approach to Negative Comments</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="approach" value="Apologize" onChange={handleChange} />
            Apologize
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="approach" value="Offer a solution" onChange={handleChange} />
            Offer a solution
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="approach" value="Ignore" onChange={handleChange} />
            Ignore
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="approach" value="Other" onChange={handleChange} />
            Other
          </label>
          <input
            type="text"
            name="approachOther"
            value={formData.negativeComments.approachOther}
            onChange={handleChange}
            className="border border-neutral-300 p-3 rounded-md"
            placeholder="Specify"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Escalation Contact</label>
        <input
          type="text"
          name="escalationContact"
          value={formData.negativeComments.escalationContact}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-md p-3"
          placeholder="Provide contact details for escalation"
        />
      </div>
    </div>
  );
};

export default NegativeComments;