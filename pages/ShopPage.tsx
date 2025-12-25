import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { IphoneModel } from '../types';
import { ArrowRight, Search, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ShopPage: React.FC = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(query);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under-35', '35-50', 'over-50'
  const [sortBy, setSortBy] = useState<string>('featured');

  // Derived Data
  const categories = Array.from(new Set(products.map(p => p.category))) as string[];
  const models = Object.values(IphoneModel) as string[];

  // Sync local state with URL param
  useEffect(() => {
    setLocalSearch(query);
  }, [query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalSearch(newVal);
    if (newVal) {
      setSearchParams({ q: newVal });
    } else {
      setSearchParams({});
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleModel = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedModels([]);
    setPriceRange('all');
    setSortBy('featured');
  };

  // 1. Filter
  const filteredProducts = products.filter(product => {
    // Search Text
    const searchLower = localSearch.toLowerCase();
    const matchesSearch = 
      product.title.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    // Category
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);

    // Price
    let matchesPrice = true;
    if (priceRange === 'under-35') matchesPrice = product.price < 35;
    if (priceRange === '35-50') matchesPrice = product.price >= 35 && product.price <= 50;
    if (priceRange === 'over-50') matchesPrice = product.price > 50;

    // Model
    const matchesModel = true; 

    return matchesSearch && matchesCategory && matchesPrice && matchesModel;
  });

  // 2. Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // featured/default
  });

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen relative">
      
      <Reveal>
        <Breadcrumbs 
          items={[
            { label: 'Home', path: '/' },
            { label: 'Shop' }
          ]}
          className="mb-6"
        />
      </Reveal>

      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <Reveal>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Shop All</h1>
            <p className="text-gray-500 max-w-xl">
              Discover our complete lineup of premium iPhone cases. Designed for protection, styled for you.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Search & Filter Bar */}
      <Reveal delay={100}>
        <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-md py-4 mb-8 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search by name or style..." 
              className="w-full pl-10 pr-6 py-3 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-black rounded-full outline-none text-sm transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-5 pr-10 py-3 border border-gray-200 rounded-full text-sm font-medium bg-white focus:outline-none focus:border-black cursor-pointer hover:border-gray-300 transition-colors h-full"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 px-6 py-3 border rounded-full text-sm font-medium transition-all ${
                isFilterOpen || selectedCategories.length > 0 || priceRange !== 'all' || selectedModels.length > 0
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {(selectedCategories.length > 0 || priceRange !== 'all' || selectedModels.length > 0) && (
                <span className="ml-1 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length + (priceRange !== 'all' ? 1 : 0) + selectedModels.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </Reveal>

      <div className="text-sm text-gray-500 mb-6 flex justify-between items-center">
        <span>Showing {sortedProducts.length} results</span>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {sortedProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 50}>
              <Link to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 rounded-3xl">
                   <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <button className="absolute bottom-4 right-4 bg-white text-black w-10 h-10 flex items-center justify-center rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
                <h3 className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">{product.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">{product.category}</span>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-500">No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setLocalSearch('');
              setSearchParams({});
              clearFilters();
            }}
            className="mt-4 text-black underline underline-offset-4"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-l-3xl overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">Category</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 border rounded-lg mr-3 flex items-center justify-center transition-colors ${selectedCategories.includes(category) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                        {selectedCategories.includes(category) && <Check size={12} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span className="text-gray-700 group-hover:text-black">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">Price</h3>
                <div className="space-y-3">
                  {[
                    { label: 'All Prices', value: 'all' },
                    { label: 'Under $35', value: 'under-35' },
                    { label: '$35 - $50', value: '35-50' },
                    { label: 'Over $50', value: 'over-50' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center transition-colors ${priceRange === option.value ? 'border-black' : 'border-gray-300 group-hover:border-black'}`}>
                         {priceRange === option.value && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="price"
                        className="hidden"
                        checked={priceRange === option.value}
                        onChange={() => setPriceRange(option.value)}
                      />
                      <span className="text-gray-700 group-hover:text-black">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">Model</h3>
                <div className="space-y-3">
                  {models.map(model => (
                    <label key={model} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 border rounded-lg mr-3 flex items-center justify-center transition-colors ${selectedModels.includes(model) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                        {selectedModels.includes(model) && <Check size={12} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedModels.includes(model)}
                        onChange={() => toggleModel(model)}
                      />
                      <span className="text-gray-700 group-hover:text-black">{model}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button 
                onClick={clearFilters}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-full transition-colors shadow-lg"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};