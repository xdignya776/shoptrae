import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ArrowRight, Search, Mail, Instagram, Heart, Star, Shield, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const instagramPosts = [
    { id: 1, img: 'https://picsum.photos/seed/insta1/600/600', likes: '2.4k' },
    { id: 2, img: 'https://picsum.photos/seed/insta2/600/600', likes: '856' },
    { id: 3, img: 'https://picsum.photos/seed/insta3/600/600', likes: '1.2k' },
    { id: 4, img: 'https://picsum.photos/seed/insta4/600/600', likes: '3.1k' },
  ];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="w-full bg-white overflow-hidden" ref={scrollRef}>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[95vh] w-full bg-gray-900 text-white overflow-hidden flex items-end">
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://picsum.photos/seed/hero_case_v2/1920/1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              className="mb-6 overflow-hidden"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b-2 border-accent pb-2 whitespace-nowrap">
                New Collection 2024
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-bold leading-[0.9] mb-8 tracking-tighter">
              Essential Protection.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Unmatched Style.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light">
              Premium materials meet precision engineering. Shop the new Leather & Artist collections designed for the iPhone 15 series.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 bg-white text-black px-10 py-5 font-bold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Shop The Drop
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 font-bold rounded-full border border-white/20 text-white hover:border-white transition-colors"
                >
                  Our Story
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED COLLECTION --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-4xl font-bold mb-3 tracking-tight">Latest Arrivals</h2>
            <p className="text-gray-500 text-lg">Fresh from the studio. Limited availability.</p>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find your vibe..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full border border-transparent focus:bg-white focus:border-black outline-none text-sm transition-all shadow-sm focus:shadow-md"
              />
            </div>
            <Link to="/shop" className="hidden md:block text-sm font-bold underline underline-offset-4 hover:opacity-60 whitespace-nowrap">VIEW ALL</Link>
          </div>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Link to={`/product/${product.id}`} className="group block h-full cursor-pointer">
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                    {/* Quick Add overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full bg-white/90 backdrop-blur-md text-black font-bold py-3 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-white">
                        View Details <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold group-hover:underline decoration-2 underline-offset-4 mb-1">{product.title}</h3>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <span className="text-gray-400 ml-1">(24)</span>
                      </div>
                    </div>
                    <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center bg-gray-50 rounded-3xl">
            <p className="text-gray-500 text-lg">No styles found matching "{searchTerm}".</p>
          </div>
        )}
      </section>

      {/* --- VALUE PROPS --- */}
      <section className="bg-primary text-white py-32 border-t border-gray-800 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why CaseDrop?</h2>
            <p className="text-gray-400">Engineered for the modern lifestyle.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Shield size={32} />,
                title: "Impact Resistant",
                desc: "Military-grade protection tested to withstand 10ft drops.",
                color: "text-blue-500",
                bg: "shadow-blue-500/20"
              },
              {
                icon: <Heart size={32} />,
                title: "Eco-Friendly",
                desc: "Crafted with 65% recycled materials. 100% compostable packaging.",
                color: "text-green-500",
                bg: "shadow-green-500/20"
              },
              {
                icon: <Zap size={32} />,
                title: "MagSafe Ready",
                desc: "Strong built-in magnets ensuring seamless connectivity.",
                color: "text-purple-500",
                bg: "shadow-purple-500/20"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <div className={`w-20 h-20 ${feature.color} bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl shadow-2xl ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="w-6 h-6" />
            <span className="font-bold">@casedrop.co</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Seen on the Gram</h2>
          <p className="text-gray-500">Tag us to be featured on our feed.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post, idx) => (
            <motion.a
              key={post.id}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group relative block aspect-square bg-gray-100 overflow-hidden rounded-2xl"
            >
              <img
                src={post.img}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Heart size={20} fill="white" /> {post.likes}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        {/* Decorative blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-[100px]"
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 3 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-3xl mb-8 shadow-2xl"
          >
            <Mail size={36} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-primary">Join the Inner Circle</h2>
            <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Sign up for exclusive access to new drops, limited edition releases, and subscriber-only offers. No spam, just vibes.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="subscribed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-50 border border-green-100 text-green-800 rounded-2xl p-8"
              >
                <p className="font-bold text-xl mb-2">🎉 You're on the list!</p>
                <p className="text-sm">Keep an eye on your inbox for a welcome gift.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white border-2 border-gray-100 rounded-full px-8 py-4 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all shadow-lg hover:shadow-xl"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-black text-white font-bold px-10 py-4 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap shadow-xl"
                >
                  Sign Up
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-gray-400 mt-8"
          >
            By signing up, you agree to our Privacy Policy.
          </motion.p>
        </div>
      </section>
    </div>
  );
};
