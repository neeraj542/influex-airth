import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

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
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-purple-100 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center text-purple-900"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaq === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-4 text-purple-800">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#contact" className="text-purple-700 hover:text-purple-900 hover:text-purple-800">
            Still have questions? Contact us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
