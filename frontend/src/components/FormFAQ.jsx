import React from "react";
import "../styles/FormFAQ.css";

const FormFAQ = () => {
  return (
    <div id="webcrumbs" className="m-[50px]">
      <div className="bg-white text-neutral-950 rounded-lg p-12 max-w-[900px] mx-auto">
        <h1 className="text-primary-950 font-title text-4xl mb-10 text-center">
          Influex-airth: Instagram Comment Automation FAQ Form
        </h1>
        <div className='flex flex-col gap-12'>
          {/* Step 1: Business Details */}
          <div className='border border-neutral-200 rounded-md p-8 transition-all duration-300 hover:shadow-lg'>
            <h2 className='text-2xl font-title mb-6 text-primary-950'>Step 1: Business Details</h2>
            <div className='flex flex-col gap-6'>
              <div>
                <label className='block mb-2'>Business Name:</label>
                <input
                  type='text'
                  className='w-full border border-neutral-300 rounded-md p-3'
                  placeholder='Enter your business name'
                />
              </div>
              <div>
                <label className='block mb-2'>Industry/Niche:</label>
                <input
                  type='text'
                  className='w-full border border-neutral-300 rounded-md p-3'
                  placeholder='e.g., Fitness, Beauty, Technology, Education, etc.'
                />
              </div>
              <div>
                <label className='block mb-2'>Social Media Handles:</label>
                <input
                  type='text'
                  className='w-full border border-neutral-300 rounded-md p-3'
                  placeholder='Provide links to your Instagram profile and other platforms if applicable'
                />
              </div>
              <div>
                <label className='block mb-2'>Target Audience:</label>
                <textarea
                  className='w-full border border-neutral-300 rounded-md p-3'
                  placeholder='Describe your typical customers. e.g., age group, location, interests'
                ></textarea>
              </div>
            </div>
          </div>
      
          {/* Step Transition Effect */}
          <div className='flex justify-center'>
            <button className='w-[60px] h-[60px] bg-primary-500 text-primary-50 text-lg rounded-full flex items-center justify-center hover:bg-primary-600 transition-transform transform hover:scale-105'>
              →
            </button>
          </div>
      
          {/* Step 2: Comment Response Preferences */}
          <div className='border border-neutral-200 rounded-md p-8 transition-all duration-300 hover:shadow-lg'>
            <h2 className='text-2xl font-title mb-6 text-primary-950'>Step 2: Comment Response Preferences</h2>
            <div className='flex flex-col gap-6'>
              <div>
                <label className='block mb-2'>Tone of Responses:</label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Friendly
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Professional
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Casual
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Other:
                  </label>
                  <input
                    type='text'
                    className='border border-neutral-300 p-3 rounded-md'
                    placeholder='Specify'
                  />
                </div>
              </div>
              <div>
                <label className='block mb-2'>Common Types of Comments You Receive:</label>
                <div className='flex flex-wrap gap-6'>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Product/service inquiries
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Compliments
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Complaints or negative feedback
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Spam or irrelevant comments
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' />
                    Others:
                  </label>
                  <input
                    type='text'
                    className='border border-neutral-300 p-3 rounded-md'
                    placeholder='Specify'
                  />
                </div>
              </div>
              <div>
                <label className='block mb-2'>Response Time Expectations:</label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-2'>
                    <input type='radio' name='response_time' />
                    Within 1 hour
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='radio' name='response_time' />
                    Within 3 hours
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='radio' name='response_time' />
                    Within 6 hours
                  </label>
                  <label className='flex items-center gap-2'>
                    <input type='radio' name='response_time' />
                    Other:
                  </label>
                  <input
                    type='text'
                    className='border border-neutral-300 p-3 rounded-md'
                    placeholder='Specify'
                  />
                </div>
              </div>
            </div>
          </div>
      
          {/* Step Transition Effect */}
          <div className='flex justify-center'>
            <button className='w-[60px] h-[60px] bg-primary-500 text-primary-50 text-lg rounded-full flex items-center justify-center hover:bg-primary-600 transition-transform transform hover:scale-105'>
              →
            </button>
          </div>
      
          {/* Step 3: Consent */}
          <div className='border border-neutral-200 rounded-md p-8 transition-all duration-300 hover:shadow-lg'>
            <h2 className='text-2xl font-title mb-6 text-primary-950'>Step 3: Consent</h2>
            <div className='flex flex-col gap-6'>
              <label className='flex items-center gap-2'>
                <input type='checkbox' />
                I authorize the use of my brand’s public content (images, videos, captions) for personalized comment replies.
              </label>
              <label className='flex items-center gap-2'>
                <input type='checkbox' />
                I agree to the terms and conditions of the Instagram comment automation service.
              </label>
            </div>
          </div>
        </div>
      
        <button className='mt-10 bg-primary-500 text-primary-50 w-[180px] py-3 rounded-md hover:bg-primary-600 flex items-center justify-center'>
          Submit
        </button>
      </div> 
    </div>
  )
}

export default FormFAQ;