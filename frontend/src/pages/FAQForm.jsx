import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { ChevronDown, Save, Trash, AlertCircle, Plus } from "lucide-react"
import axios from "axios"
import { Input } from "ui/input"
import { Textarea } from "ui/textarea"
import { Checkbox } from "ui/checkbox"
import { RadioGroup, RadioGroupItem } from "ui/radio-group"
import { Label } from "ui/label"
import { Button } from "ui/button"
import "./faq-form.css"

const FAQForm = () => {
  const [activeSection, setActiveSection] = useState("business-details")
  const [submitStatus, setSubmitStatus] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      businessName: "",
      industry: "",
      socialMedia: "",
      responsePreferences: {
        tone: [],
        responseTime: "",
      },
      faqList: [{ question: "", answer: "" }],
      negativeComments: {
        approach: [],
        escalationContact: "",
      },
      miscellaneous: {
        productsToHighlight: "",
        specialOffers: "",
        languages: "",
        flaggedKeywords: "",
        additionalNotes: "",
      },
      consent: {
        brandVoice: false,
        terms: false,
      },
    },
  })

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqList",
  })

  const onSubmit = async (data) => {
    setSubmitStatus("submitting")
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit-form`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      console.log("AWS API Response:", response.data)
      if (response.data.lambdaResponse) {
        console.log("Lambda Response:", response.data.lambdaResponse)
      } else {
        console.log("Lambda Response not found in the API response.")
      }
      setSubmitStatus("success")
    } catch (error) {
      console.error("Error calling AWS API:", error.response?.data || error.message)
      setSubmitStatus("error")
    }
  }

  const toneOptions = ["Friendly", "Professional", "Casual"]
  const commentTypeOptions = [
    "Product/service inquiries",
    "Compliments",
    "Complaints or negative feedback",
    "Spam or irrelevant comments",
  ]
  const responseTimeOptions = ["Within 1 hour", "Within 3 hours", "Within 6 hours", "Other"]

  const AccordionSection = ({ title, value, children, error }) => {
    const isActive = activeSection === value

    return (
      <div className="border rounded-lg mb-4 overflow-hidden transition-all duration-300 ease-in-out">
        <button
          type="button"
          onClick={() => setActiveSection(isActive ? "" : value)}
          className={`w-full px-4 py-3 flex justify-between items-center ${error ? "bg-red-50" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-200`}
        >
          <span className={`text-lg font-semibold ${error ? "text-red-600" : ""}`}>{title}</span>
          <div className="flex items-center">
            {error && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${isActive ? "transform rotate-180" : ""}`}
            />
          </div>
        </button>
        <div
          className={`transition-all duration-300 ease-in-out ${isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="p-4 border-t">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">
            FAQ Form for Instagram Comment Automation
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Details Section */}
            <AccordionSection
              title="Business Details"
              value="business-details"
              error={errors.businessName || errors.industry}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Controller
                    name="businessName"
                    control={control}
                    rules={{ required: "Business Name is required" }}
                    render={({ field }) => (
                      <Input id="businessName" placeholder="Enter your business name" {...field} />
                    )}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="industry">Industry/Niche</Label>
                  <Controller
                    name="industry"
                    control={control}
                    rules={{ required: "Industry is required" }}
                    render={({ field }) => (
                      <Input id="industry" placeholder="e.g., Fitness, Beauty, Technology" {...field} />
                    )}
                  />
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
                </div>
                <div>
                  <Label htmlFor="socialMedia">Social Media Handles</Label>
                  <Controller
                    name="socialMedia"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="socialMedia"
                        placeholder="Provide links to your Instagram profile and other platforms"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Response Preferences Section */}
            <AccordionSection title="Comment Response Preferences" value="response-preferences">
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Tone of Responses</Label>
                  <div className="mt-2 space-y-2">
                    {toneOptions.map((tone) => (
                      <div key={tone} className="flex items-center">
                        <Controller
                          name={`responsePreferences.tone`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`tone-${tone}`}
                              checked={field.value?.includes(tone)}
                              onCheckedChange={(checked) => {
                                const updatedTone = checked
                                  ? [...(field.value || []), tone]
                                  : (field.value || []).filter((t) => t !== tone)
                                field.onChange(updatedTone)
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`tone-${tone}`} className="ml-2">
                          {tone}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base">Response Time</Label>
                  <Controller
                    name="responsePreferences.responseTime"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="mt-2 space-y-2">
                        {responseTimeOptions.map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`time-${option}`} />
                            <Label htmlFor={`time-${option}`} className="ml-2">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* FAQ Section */}
            <AccordionSection title="Product/Service-Specific FAQs" value="product-service-faqs" error={errors.faqList}>
              <div className="space-y-4">
                <Label className="text-base">Top 5 Frequently Asked Questions from Your Audience:</Label>
                {faqFields.map((field, index) => (
                  <div key={field.id} className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50">
                    <div>
                      <Label htmlFor={`faq-question-${index}`}>Q{index + 1}:</Label>
                      <Controller
                        name={`faqList.${index}.question`}
                        control={control}
                        rules={{ required: "Question is required" }}
                        render={({ field }) => (
                          <Input id={`faq-question-${index}`} placeholder="Enter the question" {...field} />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`faq-answer-${index}`}>A{index + 1}:</Label>
                      <Controller
                        name={`faqList.${index}.answer`}
                        control={control}
                        rules={{ required: "Answer is required" }}
                        render={({ field }) => (
                          <Textarea id={`faq-answer-${index}`} placeholder="Enter the answer" {...field} />
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFaq(index)}
                      className="mt-2"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Remove FAQ
                    </Button>
                  </div>
                ))}
                {faqFields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendFaq({ question: "", answer: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add More FAQs
                  </Button>
                )}
                {errors.faqList && <p className="text-red-500 text-xs mt-1">{errors.faqList.message}</p>}

                <div>
                  <Label htmlFor="productsToHighlight">Products/Services to Highlight in Responses:</Label>
                  <Controller
                    name="miscellaneous.productsToHighlight"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="productsToHighlight"
                        placeholder="List key products/services (e.g., Premium Membership, Free Consultation)"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="specialOffers">Special Offers or Discounts to Promote:</Label>
                  <Controller
                    name="miscellaneous.specialOffers"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="specialOffers"
                        placeholder="Enter offers (e.g., 10% off, free shipping)"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Negative Comments */}
            <AccordionSection title="Negative Comments" value="negative-comments">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Preferred Approach to Negative Comments:</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      "Apologize and offer a resolution publicly",
                      "Direct the user to private messages",
                      "Remove/block spam comments",
                      "Other",
                    ].map((approach) => (
                      <div key={approach} className="flex items-center">
                        <Controller
                          name="negativeComments.approach"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`approach-${approach}`}
                              checked={field.value?.includes(approach)}
                              onCheckedChange={(checked) => {
                                const updatedApproach = checked
                                  ? [...(field.value || []), approach]
                                  : (field.value || []).filter((a) => a !== approach)
                                field.onChange(updatedApproach)
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`approach-${approach}`} className="ml-2">
                          {approach}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="escalationContact">Escalation Contact:</Label>
                  <Controller
                    name="negativeComments.escalationContact"
                    control={control}
                    render={({ field }) => (
                      <Input id="escalationContact" placeholder="Enter email or phone" {...field} />
                    )}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Miscellaneous Preferences */}
            <AccordionSection title="Miscellaneous Preferences" value="miscellaneous">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="languages">Languages for Comment Replies:</Label>
                  <Controller
                    name="miscellaneous.languages"
                    control={control}
                    render={({ field }) => <Input id="languages" placeholder="e.g., English, Hindi" {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor="flaggedKeywords">Keywords to Flag for Immediate Attention:</Label>
                  <Controller
                    name="miscellaneous.flaggedKeywords"
                    control={control}
                    render={({ field }) => (
                      <Input id="flaggedKeywords" placeholder="e.g., refund, scam, help" {...field} />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes or Customization Requests:</Label>
                  <Controller
                    name="miscellaneous.additionalNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="additionalNotes"
                        placeholder="Enter any other preferences or instructions"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Consent Section */}
            <AccordionSection
              title="Consent"
              value="consent"
              error={errors.consent?.brandVoice || errors.consent?.terms}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="consent.brandVoice"
                    control={control}
                    rules={{ required: "You must authorize the use of your brand's public content" }}
                    render={({ field }) => (
                      <Checkbox id="brandVoice" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <Label htmlFor="brandVoice">
                    I authorize the use of my brand's public content (images, videos, captions) for personalized comment
                    replies.
                  </Label>
                </div>
                {errors.consent?.brandVoice && (
                  <p className="text-red-500 text-xs mt-1">{errors.consent.brandVoice.message}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Controller
                    name="consent.terms"
                    control={control}
                    rules={{ required: "You must agree to the terms and conditions" }}
                    render={({ field }) => (
                      <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <Label htmlFor="terms">
                    I agree to the terms and conditions of the Instagram comment automation service.
                  </Label>
                </div>
                {errors.consent?.terms && <p className="text-red-500 text-xs mt-1">{errors.consent.terms.message}</p>}
              </div>
            </AccordionSection>

            {/* Submit Section */}
            <div className="flex justify-center sm:justify-end space-x-4 mt-6">
              <Button type="submit" disabled={submitStatus === "submitting"} className="px-6 py-3 text-sm sm:text-base font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">
                <Save className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                {submitStatus === "submitting" ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>

          {submitStatus === "success" && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">Form submitted successfully!</div>
          )}
          {submitStatus === "error" && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              An error occurred while submitting the form. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FAQForm

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
