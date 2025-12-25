import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Footer = () => {
  const WP_SITE_URL = import.meta.env.VITE_WP_SITE_URL || 'https://api.xdignya.uk';
  
  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold tracking-tighter mb-6">CASE<span className="font-light">DROP</span></h2>
          <p className="text-gray-400 max-w-xs mb-6">
            Elevating everyday tech essentials with premium materials and minimalist design.
            <br />Based in San Francisco.
          </p>
          <div className="flex gap-4">
            {/* Socials placeholder */}
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-gray-700">IG</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-gray-700">TW</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-gray-700">TT</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Leather Series</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href={`${WP_SITE_URL}/faq`} className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href={`${WP_SITE_URL}/shipping`} className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href={`${WP_SITE_URL}/contact`} className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href={`${WP_SITE_URL}/privacy`} className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} CaseDrop Inc. All rights reserved.</p>
        <p>Designed for aesthetic.</p>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  );
}