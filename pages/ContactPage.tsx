import React from 'react';
import { Reveal } from '../components/Reveal';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-500 mb-12">
            Have a question about your order or just want to say hi? Fill out the form below or email us directly at hello@casedrop.com.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <select 
                id="subject"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors appearance-none"
              >
                <option>Order Inquiry</option>
                <option>Product Question</option>
                <option>Returns & Exchanges</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={6}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="How can we help?"
              ></textarea>
            </div>

            <button className="w-full bg-black text-white font-medium py-4 rounded-full hover:bg-gray-800 transition-colors shadow-lg">
              Send Message
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
};