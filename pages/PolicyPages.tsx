import React from 'react';

export const ShippingPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Shipping & Returns</h1>
      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-black mb-4">Shipping Policy</h2>
          <p className="mb-4">
            Orders are processed within 1-2 business days. You will receive a shipping confirmation email with tracking information once your order has shipped.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard US Shipping:</strong> 3-5 business days ($5.99, free over $50)</li>
            <li><strong>Expedited US Shipping:</strong> 2 business days ($15.00)</li>
            <li><strong>International Shipping:</strong> 7-14 business days (Rates calculated at checkout)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-4">Returns & Exchanges</h2>
          <p className="mb-4">
            We want you to love your CaseDrop case. If you are not completely satisfied, you may return your item(s) within 30 days of delivery.
          </p>
          <p>
            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <p>
            To start a return, please contact us at support@casedrop.com with your order number.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm">
        <p>Last updated: October 2023</p>
        <p>
          This Privacy Policy describes how CaseDrop (the "Site" or "we") collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
        </p>
        
        <h2 className="text-lg font-bold text-black mt-6 mb-2">Collecting Personal Information</h2>
        <p>
          When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
        </p>

        <h2 className="text-lg font-bold text-black mt-6 mb-2">Minors</h2>
        <p>
          The Site is not intended for individuals under the age of 18. We do not intentionally collect Personal Information from children. If you are the parent or guardian and believe your child has provided us with Personal Information, please contact us at the address below to request deletion.
        </p>

        <h2 className="text-lg font-bold text-black mt-6 mb-2">Changes</h2>
        <p>
          We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
        </p>
        
        <h2 className="text-lg font-bold text-black mt-6 mb-2">Contact</h2>
        <p>
          For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@casedrop.com.
        </p>
      </div>
    </div>
  );
};