import React from 'react';

const Consent = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            consent: {
                ...formData.consent,
                [e.target.name]: e.target.checked,
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="brandVoice"
                    checked={formData.consent.brandVoice}
                    onChange={(e) => handleInputChange('consent', 'brandVoice', e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="brandVoice" className="text-sm text-gray-700">
                    I authorize the use of my brand's public content (images, videos, captions)
                    for personalized comment replies.
                </label>
            </div>
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={formData.consent.terms}
                    onChange={(e) => handleInputChange('consent', 'terms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the terms and conditions of the Instagram comment automation service.
                </label>
            </div>
        </div>
    );
};

export default Consent;