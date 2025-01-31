import React, { useState, useEffect } from 'react';
import './faq-form.css';
import { ChevronDown, Save, Trash } from 'lucide-react';
import BusinessDetails from '../components/faq-form/BusinessDetails';
import ResponsePreferences from '../components/faq-form/ResponsePreferences';
import NegativeComments from '../components/faq-form/NegativeComments';
import Miscellaneous from '../components/faq-form/Miscellaneous';
import Consent from '../components/faq-form/Consent';
import FAQSection from '../components/faq-form/FAQSection';
import AccordionSection from '../components/faq-form/AccordionSection';
import axios from 'axios';

// ErrorNotification component (inside the same file)
const ErrorNotification = ({ message }) => {
    return (
        <div className="flex items-center p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13H6m0 0V7a2 2 0 012-2h8a2 2 0 012 2v6m-4 0v7a2 2 0 01-2 2H10a2 2 0 01-2-2v-7"></path>
            </svg>
            <span>{message}</span>
        </div>
    );
};

const FAQForm = ({ accessToken, lambdaResponse }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        industry: '',
        socialMedia: '',
        targetAudience: '',
        responsePreferences: {
            tone: [],
            commentTypes: [],
            responseTime: ''
        },
        faqList: [{ question: '', answer: '' }],
        negativeComments: {
            approach: [],
            escalationContact: ''
        },
        miscellaneous: {
            productsToHighlight: '',
            specialOffers: '',
            languages: '',
            flaggedKeywords: '',
            additionalNotes: ''
        },
        consent: {
            brandVoice: false,
            terms: false
        }
    });

    const [errors, setErrors] = useState({});
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    useEffect(() => {
        console.log("Lambda Response:", lambdaResponse);
    }, [lambdaResponse]);

    const validateForm = () => {
        const newErrors = {};

        // Business Name
        if (!formData.businessName) {
            newErrors.businessName = 'Business name is required.';
        }

        // Industry
        if (!formData.industry) {
            newErrors.industry = 'Industry is required.';
        }

        // Social Media (Assuming URL format validation)
        const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.[a-zA-Z]{2,3}(\/\S*)?$/;
        if (!formData.socialMedia || !urlRegex.test(formData.socialMedia)) {
            newErrors.socialMedia = 'Please provide a valid social media URL.';
        }

        // Response Time (Ensuring it's selected)
        if (!formData.responsePreferences.responseTime) {
            newErrors.responseTime = 'Please select a response time.';
        }

        // Validate FAQs
        formData.faqList.forEach((faq, index) => {
            if (!faq.question || !faq.answer) {
                newErrors[`faq-${index}`] = 'Both question and answer are required for each FAQ.';
            }
        });

        // Consent (example for checkbox validation)
        if (!formData.consent.brandVoice || !formData.consent.terms) {
            newErrors.consent = 'You must accept all consents.';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate the form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setShowErrorNotification(true);  // Show error notification
            return; // Stop submission if there are errors
        }

        // Clear errors if no validation issues
        setErrors({});
        setShowErrorNotification(false);  // Hide error notification

        // Proceed with submission
        const accessToken = localStorage.getItem('accessToken');
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit-form`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("AWS API Response:", response.data);
        })
        .catch(error => {
            console.error("Error calling AWS API:", error.response?.data || error.message);
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-full sm:max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-purple-900">
                        FAQ Form for Instagram Comment Automation
                    </h1>

                    {showErrorNotification && (
                        <ErrorNotification message="Please fix the errors in the form before submitting." />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Business Details Section */}
                        <AccordionSection title="Business Details" value="business-details">
                            <BusinessDetails formData={formData} setFormData={setFormData} />
                            {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
                            {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
                        </AccordionSection>

                        {/* Response Preferences Section */}
                        <AccordionSection title="Response Preferences" value="response-preferences">
                            <ResponsePreferences formData={formData} setFormData={setFormData} />
                            {errors.responseTime && <p className="text-red-500 text-sm">{errors.responseTime}</p>}
                        </AccordionSection>

                        {/* FAQ Section */}
                        <AccordionSection title="Product/Service-Specific FAQs" value="product-service-faqs">
                            <FAQSection formData={formData} setFormData={setFormData} />
                            {formData.faqList.map((faq, index) => (
                                <div key={index}>
                                    {errors[`faq-${index}`] && <p className="text-red-500 text-sm">{errors[`faq-${index}`]}</p>}
                                </div>
                            ))}
                        </AccordionSection>

                        {/* Negative Comments Section */}
                        <AccordionSection title="Negative Comments" value="negative-comments">
                            <NegativeComments formData={formData} setFormData={setFormData} />
                        </AccordionSection>

                        {/* Miscellaneous Section */}
                        <AccordionSection title="Miscellaneous" value="miscellaneous">
                            <Miscellaneous formData={formData} setFormData={setFormData} />
                        </AccordionSection>

                        {/* Consent Section */}
                        <AccordionSection title="Consent" value="consent">
                            <Consent formData={formData} setFormData={setFormData} />
                            {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}
                        </AccordionSection>

                        <div className="flex justify-center sm:justify-end space-x-4 mt-6">
                            <button
                                type="submit"
                                className="px-6 py-3 text-sm sm:text-base font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
                            >
                                <Save className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FAQForm;

// ------------------------------------------------ code not working

// import React, { useState } from 'react';
// import { ChevronDown, Save, Trash } from 'lucide-react';
// import './faq-form.css'

// const FAQForm = () => {
//     const [activeSection, setActiveSection] = useState('business-details');
//     const [formData, setFormData] = useState({
//         businessName: '',
//         industry: '',
//         socialMedia: '',
//         targetAudience: '',
//         responsePreferences: {
//             tone: [],
//             commentTypes: [],
//             responseTime: ''
//         },
//         faqList: [{ question: '', answer: '' }],
//         negativeComments: {
//             approach: [],
//             escalationContact: ''
//         },
//         miscellaneous: {
//             productsToHighlight: '',
//             specialOffers: '',
//             languages: '',
//             flaggedKeywords: '',
//             additionalNotes: ''
//         },
//         consent: {
//             brandVoice: false,
//             terms: false
//         }
//     });

//     const handleInputChange = (section, field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [field]: value
//             }
//         }));
//     };

//     const handleBasicInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const addFAQItem = () => {
//         setFormData(prev => ({
//             ...prev,
//             faqList: [...prev.faqList, { question: '', answer: '' }]
//         }));
//     };

//     const handleFAQChange = (index, field, value) => {
//         const newFAQList = [...formData.faqList];
//         newFAQList[index][field] = value;
//         setFormData(prev => ({
//             ...prev,
//             faqList: newFAQList
//         }));
//     };

//     const handleDeleteFAQItem = (index) => {
//         const newFAQList = formData.faqList.filter((_, i) => i !== index);
//         setFormData(prev => ({
//             ...prev,
//             faqList: newFAQList
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // console.log('Form submitted:', formData);
//     };

//     const toneOptions = ['Friendly', 'Professional', 'Casual'];
//     const commentTypeOptions = [
//         'Product/service inquiries',
//         'Compliments',
//         'Complaints or negative feedback',
//         'Spam or irrelevant comments'
//     ];
//     const responseTimeOptions = [
//         'Within 1 hour',
//         'Within 3 hours',
//         'Within 6 hours',
//         'Other'
//     ];

//     // Custom Accordion Section Component
//     const AccordionSection = ({ title, value, children }) => {
//         const isActive = activeSection === value;

//         return (
//             <div className="border rounded-lg mb-4">
//                 <button
//                     type="button"
//                     onClick={() => setActiveSection(isActive ? '' : value)}
//                     className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
//                 >
//                     <span className="text-lg font-semibold">{title}</span>
//                     <ChevronDown
//                         className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''
//                             }`}
//                     />
//                 </button>
//                 <div
//                     className={`transition-all duration-200 overflow-hidden ${isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
//                         }`}
//                 >
//                     <div className="p-4 border-t">{children}</div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
//             <div className="max-w-3xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//                     <h1 className="text-3xl font-bold text-center mb-8 text-purple-900 mb-6">
//                         FAQ Form for Instagram Comment Automation
//                     </h1>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Business Details Section */}
//                         <AccordionSection title="Business Details" value="business-details">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Business Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.businessName}
//                                         onChange={(e) => handleBasicInputChange('businessName', e.target.value)}
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Industry/Niche
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.industry}
//                                         onChange={(e) => handleBasicInputChange('industry', e.target.value)}
//                                         placeholder="e.g., Fitness, Beauty, Technology"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Social Media Handles
//                                     </label>
//                                     <textarea
//                                         value={formData.socialMedia}
//                                         onChange={(e) => handleBasicInputChange('socialMedia', e.target.value)}
//                                         placeholder="Provide links to your Instagram profile and other platforms"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Response Preferences Section */}
//                         <AccordionSection title="Comment Response Preferences" value="response-preferences">
//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Tone of Responses
//                                     </label>
//                                     <div className="space-y-2">
//                                         {toneOptions.map((tone) => (
//                                             <div key={tone} className="flex items-center space-x-2 ">
//                                                 <input
//                                                     type="checkbox"
//                                                     id={`tone-${tone}`}
//                                                     checked={formData.responsePreferences.tone.includes(tone)}
//                                                     onChange={(e) => {
//                                                         const newTone = e.target.checked
//                                                             ? [...formData.responsePreferences.tone, tone]
//                                                             : formData.responsePreferences.tone.filter(t => t !== tone);
//                                                         handleInputChange('responsePreferences', 'tone', newTone);
//                                                     }}
//                                                     className="w-4 h-4 text-purple-600 rounded"
//                                                 />
//                                                 <label htmlFor={`tone-${tone}`} className="text-sm text-gray-700">
//                                                     {tone}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Response Time
//                                     </label>
//                                     <div className="space-y-2">
//                                         {responseTimeOptions.map((option) => (
//                                             <div key={option} className="flex items-center space-x-2">
//                                                 <input
//                                                     type="radio"
//                                                     id={`time-${option}`}
//                                                     name="responseTime"
//                                                     value={option}
//                                                     checked={formData.responsePreferences.responseTime === option}
//                                                     onChange={(e) =>
//                                                         handleInputChange('responsePreferences', 'responseTime', e.target.value)
//                                                     }
//                                                     className="w-4 h-4 text-purple-600 focus:ring-purple-500"
//                                                 />
//                                                 <label htmlFor={`time-${option}`} className="text-sm text-gray-700">
//                                                     {option}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* FAQ Section */}
//                         <AccordionSection title="Product/Service-Specific FAQs" value="product-service-faqs">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Top 5 Frequently Asked Questions from Your Audience:
//                                     </label>
//                                     {formData.faqList.map((faq, index) => (
//                                         <div key={index} className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50">
//                                             <div>
//                                                 <label className="text-sm font-medium text-gray-600">
//                                                     Q{index + 1}:
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     value={faq.question}
//                                                     onChange={(e) => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList[index].question = e.target.value;
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     placeholder="Enter the question"
//                                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="text-sm font-medium text-gray-600">
//                                                     A{index + 1}:
//                                                 </label>
//                                                 <textarea
//                                                     value={faq.answer}
//                                                     onChange={(e) => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList[index].answer = e.target.value;
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     placeholder="Enter the answer"
//                                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
//                                                     rows={2}
//                                                 />
//                                             </div>
//                                             <div className="flex justify-end mt-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList.splice(index, 1);
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     className="text-sm text-red-600 hover:underline"
//                                                 >
//                                                     Remove FAQ
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {formData.faqList.length < 5 && (
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 handleBasicInputChange('faqList', [
//                                                     ...formData.faqList,
//                                                     { question: '', answer: '' }
//                                                 ])
//                                             }
//                                             className="text-sm text-purple-600 hover:underline"
//                                         >
//                                             + Add More FAQs
//                                         </button>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Products/Services to Highlight in Responses:
//                                     </label>
//                                     <textarea
//                                         value={formData.productsToHighlight || ''}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'productsToHighlight', e.target.value)}
//                                         placeholder="List key products/services (e.g., Premium Membership, Free Consultation)"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Special Offers or Discounts to Promote:
//                                     </label>
//                                     <textarea
//                                         value={formData.specialOffers || ''}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'specialOffers', e.target.value)}
//                                         placeholder="Enter offers (e.g., 10% off, free shipping)"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Negative Comments */}
//                         <AccordionSection title="Negative Comments" value="negative-comments">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Preferred Approach to Negative Comments:
//                                     </label>
//                                     <div className="space-y-2">
//                                         {['Apologize and offer a resolution publicly', 'Direct the user to private messages', 'Remove/block spam comments', 'Other'].map((approach) => (
//                                             <div key={approach} className="flex items-center space-x-2">
//                                                 <input
//                                                     type="checkbox"
//                                                     id={`approach-${approach}`}
//                                                     checked={formData.negativeComments.approach.includes(approach)}
//                                                     onChange={(e) => {
//                                                         const newApproach = e.target.checked
//                                                             ? [...formData.negativeComments.approach, approach]
//                                                             : formData.negativeComments.approach.filter((a) => a !== approach);
//                                                         handleInputChange('negativeComments', 'approach', newApproach);
//                                                     }}
//                                                     className="w-4 h-4 text-purple-600 rounded"
//                                                 />
//                                                 <label htmlFor={`approach-${approach}`} className="text-sm text-gray-700">
//                                                     {approach}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Escalation Contact:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.negativeComments.escalationContact}
//                                         onChange={(e) => handleInputChange('negativeComments', 'escalationContact', e.target.value)}
//                                         placeholder="Enter email or phone"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Miscellaneous Preferences */}
//                         <AccordionSection title="Miscellaneous Preferences" value="miscellaneous">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Languages for Comment Replies:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.miscellaneous.languages}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'languages', e.target.value)}
//                                         placeholder="e.g., English, Hindi"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Keywords to Flag for Immediate Attention:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.miscellaneous.flaggedKeywords}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'flaggedKeywords', e.target.value)}
//                                         placeholder="e.g., refund, scam, help"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Additional Notes or Customization Requests:
//                                     </label>
//                                     <textarea
//                                         value={formData.miscellaneous.additionalNotes}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'additionalNotes', e.target.value)}
//                                         placeholder="Enter any other preferences or instructions"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Consent Section */}
//                         <AccordionSection title="Consent" value="consent">
//                             <div className="space-y-4">
//                                 <div className="flex items-start space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         id="brandVoice"
//                                         checked={formData.consent.brandVoice}
//                                         onChange={(e) => handleInputChange('consent', 'brandVoice', e.target.checked)}
//                                         className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                                     />
//                                     <label htmlFor="brandVoice" className="text-sm text-gray-700">
//                                         I authorize the use of my brand's public content (images, videos, captions)
//                                         for personalized comment replies.
//                                     </label>
//                                 </div>
//                                 <div className="flex items-start space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         id="terms"
//                                         checked={formData.consent.terms}
//                                         onChange={(e) => handleInputChange('consent', 'terms', e.target.checked)}
//                                         className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                                     />
//                                     <label htmlFor="terms" className="text-sm text-gray-700">
//                                         I agree to the terms and conditions of the Instagram comment automation service.
//                                     </label>
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Submit Section */}
//                         <div className="flex justify-end space-x-4">
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             >
//                                 <Save className="w-4 h-4 inline-block mr-2" />
//                                 Save
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FAQForm;



// ------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import { ChevronDown, Save, Trash } from 'lucide-react';
// import './faq-form.css'

// const FAQForm = () => {
//     const [activeSection, setActiveSection] = useState('business-details');
//     const [formData, setFormData] = useState({
//         businessName: '',
//         industry: '',
//         socialMedia: '',
//         targetAudience: '',
//         responsePreferences: {
//             tone: [],
//             commentTypes: [],
//             responseTime: ''
//         },
//         faqList: [{ question: '', answer: '' }],
//         negativeComments: {
//             approach: [],
//             escalationContact: ''
//         },
//         miscellaneous: {
//             productsToHighlight: '',
//             specialOffers: '',
//             languages: '',
//             flaggedKeywords: '',
//             additionalNotes: ''
//         },
//         consent: {
//             brandVoice: false,
//             terms: false
//         }
//     });

//     const handleInputChange = (section, field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [field]: value
//             }
//         }));
//     };

//     const handleBasicInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const addFAQItem = () => {
//         setFormData(prev => ({
//             ...prev,
//             faqList: [...prev.faqList, { question: '', answer: '' }]
//         }));
//     };

//     const handleFAQChange = (index, field, value) => {
//         const newFAQList = [...formData.faqList];
//         newFAQList[index][field] = value;
//         setFormData(prev => ({
//             ...prev,
//             faqList: newFAQList
//         }));
//     };

//     const handleDeleteFAQItem = (index) => {
//         const newFAQList = formData.faqList.filter((_, i) => i !== index);
//         setFormData(prev => ({
//             ...prev,
//             faqList: newFAQList
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // console.log('Form submitted:', formData);
//     };

//     const toneOptions = ['Friendly', 'Professional', 'Casual'];
//     const commentTypeOptions = [
//         'Product/service inquiries',
//         'Compliments',
//         'Complaints or negative feedback',
//         'Spam or irrelevant comments'
//     ];
//     const responseTimeOptions = [
//         'Within 1 hour',
//         'Within 3 hours',
//         'Within 6 hours',
//         'Other'
//     ];

//     // Custom Accordion Section Component
//     const AccordionSection = ({ title, value, children }) => {
//         const isActive = activeSection === value;

//         return (
//             <div className="border rounded-lg mb-4">
//                 <button
//                     type="button"
//                     onClick={() => setActiveSection(isActive ? '' : value)}
//                     className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
//                 >
//                     <span className="text-lg font-semibold">{title}</span>
//                     <ChevronDown
//                         className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''
//                             }`}
//                     />
//                 </button>
//                 <div
//                     className={`transition-all duration-200 overflow-hidden ${isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
//                         }`}
//                 >
//                     <div className="p-4 border-t">{children}</div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
//             <div className="max-w-3xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//                     <h1 className="text-3xl font-bold text-center mb-8 text-purple-900 mb-6">
//                         FAQ Form for Instagram Comment Automation
//                     </h1>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Business Details Section */}
//                         <AccordionSection title="Business Details" value="business-details">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Business Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.businessName}
//                                         onChange={(e) => handleBasicInputChange('businessName', e.target.value)}
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Industry/Niche
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.industry}
//                                         onChange={(e) => handleBasicInputChange('industry', e.target.value)}
//                                         placeholder="e.g., Fitness, Beauty, Technology"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Social Media Handles
//                                     </label>
//                                     <textarea
//                                         value={formData.socialMedia}
//                                         onChange={(e) => handleBasicInputChange('socialMedia', e.target.value)}
//                                         placeholder="Provide links to your Instagram profile and other platforms"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Response Preferences Section */}
//                         <AccordionSection title="Comment Response Preferences" value="response-preferences">
//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Tone of Responses
//                                     </label>
//                                     <div className="space-y-2">
//                                         {toneOptions.map((tone) => (
//                                             <div key={tone} className="flex items-center space-x-2 ">
//                                                 <input
//                                                     type="checkbox"
//                                                     id={`tone-${tone}`}
//                                                     checked={formData.responsePreferences.tone.includes(tone)}
//                                                     onChange={(e) => {
//                                                         const newTone = e.target.checked
//                                                             ? [...formData.responsePreferences.tone, tone]
//                                                             : formData.responsePreferences.tone.filter(t => t !== tone);
//                                                         handleInputChange('responsePreferences', 'tone', newTone);
//                                                     }}
//                                                     className="w-4 h-4 text-purple-600 rounded"
//                                                 />
//                                                 <label htmlFor={`tone-${tone}`} className="text-sm text-gray-700">
//                                                     {tone}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Response Time
//                                     </label>
//                                     <div className="space-y-2">
//                                         {responseTimeOptions.map((option) => (
//                                             <div key={option} className="flex items-center space-x-2">
//                                                 <input
//                                                     type="radio"
//                                                     id={`time-${option}`}
//                                                     name="responseTime"
//                                                     value={option}
//                                                     checked={formData.responsePreferences.responseTime === option}
//                                                     onChange={(e) =>
//                                                         handleInputChange('responsePreferences', 'responseTime', e.target.value)
//                                                     }
//                                                     className="w-4 h-4 text-purple-600 focus:ring-purple-500"
//                                                 />
//                                                 <label htmlFor={`time-${option}`} className="text-sm text-gray-700">
//                                                     {option}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* FAQ Section */}
//                         <AccordionSection title="Product/Service-Specific FAQs" value="product-service-faqs">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Top 5 Frequently Asked Questions from Your Audience:
//                                     </label>
//                                     {formData.faqList.map((faq, index) => (
//                                         <div key={index} className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50">
//                                             <div>
//                                                 <label className="text-sm font-medium text-gray-600">
//                                                     Q{index + 1}:
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     value={faq.question}
//                                                     onChange={(e) => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList[index].question = e.target.value;
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     placeholder="Enter the question"
//                                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="text-sm font-medium text-gray-600">
//                                                     A{index + 1}:
//                                                 </label>
//                                                 <textarea
//                                                     value={faq.answer}
//                                                     onChange={(e) => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList[index].answer = e.target.value;
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     placeholder="Enter the answer"
//                                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
//                                                     rows={2}
//                                                 />
//                                             </div>
//                                             <div className="flex justify-end mt-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => {
//                                                         const newFaqList = [...formData.faqList];
//                                                         newFaqList.splice(index, 1);
//                                                         handleBasicInputChange('faqList', newFaqList);
//                                                     }}
//                                                     className="text-sm text-red-600 hover:underline"
//                                                 >
//                                                     Remove FAQ
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {formData.faqList.length < 5 && (
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 handleBasicInputChange('faqList', [
//                                                     ...formData.faqList,
//                                                     { question: '', answer: '' }
//                                                 ])
//                                             }
//                                             className="text-sm text-purple-600 hover:underline"
//                                         >
//                                             + Add More FAQs
//                                         </button>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Products/Services to Highlight in Responses:
//                                     </label>
//                                     <textarea
//                                         value={formData.productsToHighlight || ''}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'productsToHighlight', e.target.value)}
//                                         placeholder="List key products/services (e.g., Premium Membership, Free Consultation)"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Special Offers or Discounts to Promote:
//                                     </label>
//                                     <textarea
//                                         value={formData.specialOffers || ''}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'specialOffers', e.target.value)}
//                                         placeholder="Enter offers (e.g., 10% off, free shipping)"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Negative Comments */}
//                         <AccordionSection title="Negative Comments" value="negative-comments">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Preferred Approach to Negative Comments:
//                                     </label>
//                                     <div className="space-y-2">
//                                         {['Apologize and offer a resolution publicly', 'Direct the user to private messages', 'Remove/block spam comments', 'Other'].map((approach) => (
//                                             <div key={approach} className="flex items-center space-x-2">
//                                                 <input
//                                                     type="checkbox"
//                                                     id={`approach-${approach}`}
//                                                     checked={formData.negativeComments.approach.includes(approach)}
//                                                     onChange={(e) => {
//                                                         const newApproach = e.target.checked
//                                                             ? [...formData.negativeComments.approach, approach]
//                                                             : formData.negativeComments.approach.filter((a) => a !== approach);
//                                                         handleInputChange('negativeComments', 'approach', newApproach);
//                                                     }}
//                                                     className="w-4 h-4 text-purple-600 rounded"
//                                                 />
//                                                 <label htmlFor={`approach-${approach}`} className="text-sm text-gray-700">
//                                                     {approach}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Escalation Contact:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.negativeComments.escalationContact}
//                                         onChange={(e) => handleInputChange('negativeComments', 'escalationContact', e.target.value)}
//                                         placeholder="Enter email or phone"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Miscellaneous Preferences */}
//                         <AccordionSection title="Miscellaneous Preferences" value="miscellaneous">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Languages for Comment Replies:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.miscellaneous.languages}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'languages', e.target.value)}
//                                         placeholder="e.g., English, Hindi"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Keywords to Flag for Immediate Attention:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={formData.miscellaneous.flaggedKeywords}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'flaggedKeywords', e.target.value)}
//                                         placeholder="e.g., refund, scam, help"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Additional Notes or Customization Requests:
//                                     </label>
//                                     <textarea
//                                         value={formData.miscellaneous.additionalNotes}
//                                         onChange={(e) => handleInputChange('miscellaneous', 'additionalNotes', e.target.value)}
//                                         placeholder="Enter any other preferences or instructions"
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Consent Section */}
//                         <AccordionSection title="Consent" value="consent">
//                             <div className="space-y-4">
//                                 <div className="flex items-start space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         id="brandVoice"
//                                         checked={formData.consent.brandVoice}
//                                         onChange={(e) => handleInputChange('consent', 'brandVoice', e.target.checked)}
//                                         className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                                     />
//                                     <label htmlFor="brandVoice" className="text-sm text-gray-700">
//                                         I authorize the use of my brand's public content (images, videos, captions)
//                                         for personalized comment replies.
//                                     </label>
//                                 </div>
//                                 <div className="flex items-start space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         id="terms"
//                                         checked={formData.consent.terms}
//                                         onChange={(e) => handleInputChange('consent', 'terms', e.target.checked)}
//                                         className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                                     />
//                                     <label htmlFor="terms" className="text-sm text-gray-700">
//                                         I agree to the terms and conditions of the Instagram comment automation service.
//                                     </label>
//                                 </div>
//                             </div>
//                         </AccordionSection>

//                         {/* Submit Section */}
//                         <div className="flex justify-end space-x-4">
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             >
//                                 <Save className="w-4 h-4 inline-block mr-2" />
//                                 Save
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FAQForm;



// ------------------------------------------------------------------------------------------------------------------------------------
