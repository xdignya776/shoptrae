import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={toggleCart}
        />
        
        {/* Drawer */}
        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 md:rounded-l-3xl overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <ShoppingBag size={20} />
              Your Cart
            </h2>
            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Your cart is empty.</p>
                <button onClick={toggleCart} className="text-black underline underline-offset-4 hover:opacity-70">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${item.variant}`} className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-20 h-24 object-cover bg-gray-50 rounded-2xl"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.variant}</p>
                      
                      {/* Cart Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2 bg-gray-50 rounded-lg p-1 w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm transition-all disabled:opacity-50 text-gray-600 hover:text-black"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm transition-all text-gray-600 hover:text-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 text-center">
                Shipping & taxes calculated at checkout.
              </p>
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-black text-white py-4 font-medium text-lg hover:bg-gray-900 transition-colors rounded-full shadow-xl"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};