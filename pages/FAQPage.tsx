import React from 'react';

const faqs = [
  {
    question: "Do your cases support MagSafe?",
    answer: "Yes! All our cases for iPhone 12 and newer feature built-in magnets that are fully compatible with MagSafe chargers and accessories."
  },
  {
    question: "How protective are these cases?",
    answer: "Our cases are drop-tested up to 10 feet (3 meters). They feature raised bezels around the screen and camera to prevent scratches on flat surfaces."
  },
  {
    question: "Do you ship internationally?",
    answer: "We currently ship to the US, Canada, UK, and select EU countries. International shipping times vary between 7-14 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your case, you can return it for a full refund, minus shipping costs."
  },
  {
    question: "Does the clear case yellow over time?",
    answer: "Our Frost Clear cases are made with high-grade polycarbonate treated with an anti-yellowing UV coating to keep them looking crystal clear for longer."
  },
  {
    question: "How long does shipping take?",
    answer: "Orders are processed within 1-2 business days. Standard shipping in the US takes 3-5 business days."
  }
];

export const FAQPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};