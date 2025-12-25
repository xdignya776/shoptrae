import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { wooService } from '../services/wooService';
import { CheckoutInput } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartTotal, cart, syncCart } = useCart();
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutInput>({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    paymentMethod: 'bacs',
  });

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('processing');

    try {
      const result = await wooService.processCheckout(formData, cart);
      
      if (result.success) {
        setStep('success');
        // Clear cart after successful checkout
        await syncCart();
      } else {
        setError(result.error || 'Checkout failed. Please try again.');
        setStep('details');
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || 'Checkout failed. Please try again.');
      setStep('details');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={18} className="text-green-600" />
            Secure Checkout
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handlePay} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total to pay</p>
                  <p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  {cart.reduce((a, b) => a + b.quantity, 0)} items
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Shipping Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Address</label>
                  <input 
                    required
                    type="text" 
                    value={formData.address1}
                    onChange={(e) => setFormData({...formData, address1: e.target.value})}
                    placeholder="123 Main St"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">City</label>
                    <input 
                      required
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="San Francisco"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">State</label>
                    <input 
                      required
                      type="text" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="CA"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Postal Code</label>
                    <input 
                      required
                      type="text" 
                      value={formData.postcode}
                      onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                      placeholder="94102"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Country</label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-all text-sm"
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="AT">Austria</option>
                      <option value="CH">Switzerland</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="PL">Poland</option>
                      <option value="GR">Greece</option>
                      <option value="PT">Portugal</option>
                      <option value="IE">Ireland</option>
                      <option value="NZ">New Zealand</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                      <option value="MX">Mexico</option>
                      <option value="AR">Argentina</option>
                      <option value="ZA">South Africa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-black transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="bacs"
                      checked={formData.paymentMethod === 'bacs'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <span className="text-sm">Bank Transfer (BACS)</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-black transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <span className="text-sm">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Complete Order - ${cartTotal.toFixed(2)}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Your payment will be processed securely by WooCommerce
              </p>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Processing payment...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Thank you for your purchase. You will receive an email confirmation shortly with your order details.
                </p>
              </div>
              <button 
                onClick={() => {
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    address1: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: 'US',
                    paymentMethod: 'bacs',
                  });
                  setStep('details');
                  onClose();
                }} 
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};