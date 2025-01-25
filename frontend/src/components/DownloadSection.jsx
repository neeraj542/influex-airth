
import React from 'react';
import { ChevronDown, ChevronUp, Monitor, Mail, Twitter, Linkedin } from 'lucide-react';


const DownloadSection = ({ navigate }) => (

    <section id="download" className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-purple-900">Get Started with Our Web Extension</h2>
        <p className="text-purple-800 mb-8 max-w-2xl mx-auto">
            Install our browser extension to start automating your comments and saving time today.
        </p>
        <div className="flex justify-center space-x-4">
            <button className="flex items-center bg-purple-800 space-x-2 text-white px-6 py-3 rounded-lg hover:bg-purple-900">
            <Monitor size={24} />
            <span>Chrome</span>
            </button>
            <button className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg bg-purple-800 hover:bg-purple-900">
            <Monitor size={24} />
            <span>Firefox</span>
            </button>
        </div>
        </div>
    </section>
);

export default DownloadSection;
