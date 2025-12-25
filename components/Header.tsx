import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart, cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartClick = () => {
    toggleCart();
  };

  const handleSearchClick = () => {
    navigate('/shop');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-10">

        {/* Mobile Menu & Nav */}
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 hover:bg-black/5 rounded-full">
            <Menu size={24} />
          </button>
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            <Link to="/shop" className="hover:opacity-60 transition-opacity">SHOP</Link>
            <Link to="/shop" className="hover:opacity-60 transition-opacity">COLLECTIONS</Link>
            <Link to="/about" className="hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link to="/contact" className="hover:opacity-60 transition-opacity">CONTACT</Link>
          </nav>
        </div>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl tracking-tighter">
          CASE<span className="font-light">DROP</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>

          <button
            onClick={handleCartClick}
            className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};