import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = ({ formData, setFormData }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBasicInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFAQItem = () => {
    setFormData(prev => ({
      ...prev,
      faqList: [...prev.faqList, { question: '', answer: '' }]
    }));
  };

  const handleFAQChange = (index, field, value) => {
    const newFAQList = [...formData.faqList];
    newFAQList[index][field] = value;
    setFormData(prev => ({
      ...prev,
      faqList: newFAQList
    }));
  };

  const handleDeleteFAQItem = (index) => {
    const newFAQList = formData.faqList.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      faqList: newFAQList
    }));
  };

  const faqs = [
    {
      question: "What platforms does your tool support?",
      answer: "Our tool currently supports major social media platforms including Twitter, LinkedIn, and Instagram.",
    },
    {
      question: "How does the free trial work?",
      answer: "Start with a 14-day free trial with full access to all features. No credit card required.",
    },
    {
      question: "Is my data secure?",
      answer: "We use industry-standard encryption and never share your data with third parties.",
    },
    {
      question: "Can I customize responses?",
      answer: "Yes, you can create custom response templates and automation rules.",
    },
  ];

  return (
    <section id="faq" className="py-16">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top 5 Frequently Asked Questions from Your Audience:
          </label>
          {formData.faqList.map((faq, index) => (
            <div key={index} className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Q{index + 1}:
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const newFaqList = [...formData.faqList];
                    newFaqList[index].question = e.target.value;
                    handleBasicInputChange('faqList', newFaqList);
                  }}
                  placeholder="Enter the question"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  A{index + 1}:
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const newFaqList = [...formData.faqList];
                    newFaqList[index].answer = e.target.value;
                    handleBasicInputChange('faqList', newFaqList);
                  }}
                  placeholder="Enter the answer"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
                  rows={2}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newFaqList = [...formData.faqList];
                    newFaqList.splice(index, 1);
                    handleBasicInputChange('faqList', newFaqList);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove FAQ
                </button>
              </div>
            </div>
          ))}
          {formData.faqList.length < 5 && (
            <button
              type="button"
              onClick={() =>
                handleBasicInputChange('faqList', [
                  ...formData.faqList,
                  { question: '', answer: '' }
                ])
              }
              className="text-sm text-purple-600 hover:underline"
            >
              + Add More FAQs
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Products/Services to Highlight in Responses:
          </label>
          <textarea
            value={formData.productsToHighlight || ''}
            onChange={(e) => handleInputChange('miscellaneous', 'productsToHighlight', e.target.value)}
            placeholder="List key products/services (e.g., Premium Membership, Free Consultation)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Offers or Discounts to Promote:
          </label>
          <textarea
            value={formData.specialOffers || ''}
            onChange={(e) => handleInputChange('miscellaneous', 'specialOffers', e.target.value)}
            placeholder="Enter offers (e.g., 10% off, free shipping)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
