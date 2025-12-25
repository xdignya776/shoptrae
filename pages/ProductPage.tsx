import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { IphoneModel } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Sparkles, Truck, ShieldCheck, Info, Heart, Share2, Facebook, Twitter, Link as LinkIcon, Check, Minus, Plus } from 'lucide-react';
import { generateVibeCheck } from '../services/geminiService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Reveal } from '../components/Reveal';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedModel, setSelectedModel] = useState<IphoneModel | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [aiDescription, setAiDescription] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [showPreOrderInfo, setShowPreOrderInfo] = useState(false);
  
  // Share State
  const [copied, setCopied] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, name: "Alex M.", rating: 5, date: "2 days ago", comment: "Absolutely love the texture. Feels premium." },
    { id: 2, name: "Sarah K.", rating: 4, date: "1 week ago", comment: "Great protection, but I wish there were more colors." },
    { id: 3, name: "James R.", rating: 5, date: "2 weeks ago", comment: "Best case I've ever owned. MagSafe works perfectly." },
  ]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  const isWishlisted = isInWishlist(product.id);

  const handleVibeCheck = async () => {
    setLoadingAi(true);
    const desc = await generateVibeCheck(product.title, product.baseDescription);
    setAiDescription(desc);
    setLoadingAi(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    
    const newReview = {
      id: Date.now(),
      name: reviewForm.name,
      rating: reviewForm.rating,
      date: "Just now",
      comment: reviewForm.comment
    };
    
    setReviews([newReview, ...reviews]);
    setReviewForm({ name: '', rating: 5, comment: '' });
  };

  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <Breadcrumbs 
          items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: product.category, path: '/shop' },
            { label: product.title }
          ]}
          className="mb-8"
        />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
        
        {/* Image Section */}
        <Reveal>
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden relative group">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src={`https://picsum.photos/seed/${product.id}-2/400/500`} alt="detail" className="rounded-2xl w-full h-full object-cover" />
               <img src={`https://picsum.photos/seed/${product.id}-3/400/500`} alt="detail" className="rounded-2xl w-full h-full object-cover" />
            </div>
          </div>
        </Reveal>

        {/* Info Section */}
        <Reveal delay={200}>
          <div className="flex flex-col h-full sticky top-32">
            <div className="flex justify-between items-start">
               <div>
                  <div className="mb-2 text-sm text-gray-500 uppercase tracking-widest">{product.category}</div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">{product.title}</h1>
               </div>
               
               {/* Social Share */}
               <div className="flex gap-2">
                 <button 
                    onClick={copyToClipboard} 
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                    title="Copy Link"
                 >
                   {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                 </button>
                 <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.title} on CaseDrop!`)}&url=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-400"
                 >
                   <Twitter size={18} />
                 </a>
                 <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-600"
                 >
                   <Facebook size={18} />
                 </a>
               </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"} 
                    className={star <= Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>

            <div className="text-2xl font-medium mb-8">${product.price.toFixed(2)}</div>

            {/* AI Feature */}
            <div className="mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  AI Vibe Check
                </h3>
                <button 
                  onClick={handleVibeCheck}
                  disabled={loadingAi}
                  className="text-xs bg-black text-white px-3 py-1 rounded-full hover:opacity-80 disabled:opacity-50 transition-all"
                >
                  {loadingAi ? "Generating..." : "Generate Vibe"}
                </button>
              </div>
              <p className={`text-gray-700 leading-relaxed ${loadingAi ? 'animate-pulse' : ''}`}>
                {aiDescription || product.baseDescription}
              </p>
            </div>

            {/* Model Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Select Model</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(IphoneModel).map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`py-3 px-4 text-sm border rounded-full transition-all ${
                      selectedModel === model 
                        ? 'border-black bg-black text-white shadow-lg' 
                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
              {!selectedModel && <p className="text-red-500 text-xs mt-2">* Please select a model</p>}
            </div>

            {/* Pre-order Info */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Pre-order. Delivery: 7-13 business days</span>
              <div className="relative">
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onMouseEnter={() => setShowPreOrderInfo(true)}
                  onMouseLeave={() => setShowPreOrderInfo(false)}
                  onClick={() => setShowPreOrderInfo(!showPreOrderInfo)}
                  aria-label="Pre-order info"
                >
                  <Info size={14} className="text-gray-400" />
                </button>
                
                {showPreOrderInfo && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-50 text-xs text-gray-600 animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-bold text-black mb-2">Pre-order Details</h4>
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Pre-ordering items reduces excess waste caused by unsold inventory.</li>
                      <li>If you place an order with pre-order items and other regular items, they will still be shipped together. No need to worry though! It's faster than you think!</li>
                    </ol>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                  <button 
                    onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} 
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16}/>
                  </button>
                  <span className="font-bold w-8 text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                  >
                    <Plus size={16}/>
                  </button>
              </div>

              <button
                onClick={() => selectedModel && addToCart(product, selectedModel, quantity)}
                disabled={!selectedModel}
                className="flex-1 bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-full shadow-xl"
              >
                {selectedModel ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` : 'Select Options'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-16 flex items-center justify-center rounded-full border transition-all shadow-sm hover:shadow-md ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-100 text-red-500' 
                    : 'bg-white border-gray-200 text-gray-400 hover:text-black hover:border-black'
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 2} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Truck size={16} />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Review Section */}
      <Reveal>
        <div className="border-t border-gray-100 pt-16">
           <div className="flex flex-col md:flex-row gap-12">
             {/* Review Summary & Form */}
             <div className="md:w-1/3 space-y-8">
                <div>
                   <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                   <div className="flex items-center gap-4 mb-2">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={24} 
                            fill={star <= Math.round(averageRating) ? "currentColor" : "none"} 
                            className={star <= Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                   </div>
                   <p className="text-gray-500">Based on {reviews.length} reviews</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl">
                   <h3 className="font-bold mb-4">Write a Review</h3>
                   <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                         <label className="block text-xs font-medium mb-1">Rating</label>
                         <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                 key={star}
                                 type="button"
                                 onClick={() => setReviewForm({...reviewForm, rating: star})}
                                 className="hover:scale-110 transition-transform"
                               >
                                  <Star 
                                    size={20} 
                                    fill={star <= reviewForm.rating ? "currentColor" : "none"} 
                                    className={star <= reviewForm.rating ? "text-yellow-500" : "text-gray-300"}
                                  />
                               </button>
                            ))}
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-medium mb-1">Name</label>
                         <input 
                           required
                           type="text"
                           value={reviewForm.name}
                           onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                           placeholder="Your Name"
                           className="w-full p-2 rounded-lg border border-gray-200 focus:border-black outline-none bg-white text-sm"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-medium mb-1">Review</label>
                         <textarea 
                           required
                           rows={3}
                           value={reviewForm.comment}
                           onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                           placeholder="How do you like the case?"
                           className="w-full p-2 rounded-lg border border-gray-200 focus:border-black outline-none bg-white resize-none text-sm"
                         />
                      </div>
                      <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                         Submit Review
                      </button>
                   </form>
                </div>
             </div>

             {/* Reviews List */}
             <div className="flex-1 space-y-6">
                {reviews.map((review) => (
                   <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 animate-in fade-in duration-500">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">
                               {review.name.charAt(0)}
                            </div>
                            <span className="font-medium">{review.name}</span>
                         </div>
                         <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= review.rating ? "currentColor" : "none"} 
                            className={star <= review.rating ? "text-yellow-500" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{review.comment}</p>
                   </div>
                ))}
             </div>
           </div>
        </div>
      </Reveal>
    </div>
  );
};