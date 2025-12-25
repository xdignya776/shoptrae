import React from 'react';
import { Reveal } from '../components/Reveal';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Designed for aesthetic.<br/>Built for life.
          </h1>
        </Reveal>
        
        <Reveal delay={200}>
          <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden mb-12">
            <img 
              src="https://picsum.photos/seed/about/1200/800" 
              alt="Design Studio" 
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>

        <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
          <Reveal delay={300}>
            <p>
              CaseDrop started with a simple idea: phone cases shouldn't just be functional, they should be an extension of your personal style. In a world of cheap plastic and bulky rubber, we wanted to create something that felt premium to the touch and looked right at home on a runway.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p>
              Based in San Francisco, our small team of designers obsesses over every detail. From the grain of our leather to the clarity of our polycarbonate, we source only the best materials. We believe that the objects you interact with hundreds of times a day deserve to be beautiful.
            </p>
          </Reveal>
          <Reveal delay={500}>
            <p>
              But we're not just about looks. Every CaseDrop case is engineered for serious protection, rigorously tested to withstand the drops and bumps of modern life. It's the perfect balance of form and function.
            </p>
          </Reveal>
        </div>

        <Reveal delay={600}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-100 text-center">
            <div>
              <div className="text-3xl font-bold text-black mb-2">10k+</div>
              <div className="text-sm text-gray-500">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">100%</div>
              <div className="text-sm text-gray-500">Satisfaction Guarantee</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-black mb-2">24/7</div>
              <div className="text-sm text-gray-500">Support Team</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};