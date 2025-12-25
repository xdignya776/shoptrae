import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export const CollectionsPage: React.FC = () => {
  const { products } = useProducts();
  // Extract unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <Reveal>
        <h1 className="text-4xl font-bold tracking-tight mb-12">Collections</h1>
      </Reveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, index) => {
          // Find the first product image for this category to use as cover
          const coverImage = products.find(p => p.category === category)?.image;

          return (
            <Reveal key={category} delay={index * 100}>
              <Link 
                to="/shop" 
                className="group relative aspect-video md:aspect-[16/9] overflow-hidden rounded-3xl bg-gray-100 block"
              >
                <img 
                  src={coverImage} 
                  alt={category} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{category}</h2>
                  <span className="flex items-center gap-2 text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore Collection <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};