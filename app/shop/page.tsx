'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Grid, List, X, SlidersHorizontal, TrendingUp, Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { ProductGrid3D } from '@/components/ProductGrid3D';
import { Product } from '@/context/CartContext';
import RedParticleSystem from '@/components/RedParticleSystem';

gsap.registerPlugin(ScrollTrigger);

// ------------------- DUMMY DATA -------------------
const allProducts: Product[] = [
  { id: '1', name: 'Air Max Revolution', price: 299, image: '/models/airmax.png', brand: 'Nike', color: 'Red/White', size: '10', model: 'Air Max Revolution' },
  { id: '2', name: 'Ultra Boost 3D', price: 259, image: '/models/adidasboost.png', brand: 'Adidas', color: 'Black/Gold', size: '9', model: 'Ultra Boost 3D' },
  { id: '3', name: 'Jordan Infinity', price: 399, image: '/models/nikeinfinity.png', brand: 'Jordan', color: 'White/Blue', size: '11', model: 'Jordan Infinity' },
  { id: '4', name: 'Yeezy Future', price: 449, image: '/models/yeezy.png', brand: 'Adidas', color: 'Beige/Brown', size: '10', model: 'Yeezy Future' },
  { id: '5', name: 'Chuck Taylor All-Star 3D', price: 159, image: '/models/converse.png', brand: 'Converse', color: 'Black/White', size: '9', model: 'Chuck Taylor All-Star 3D' },
  { id: '6', name: 'Air Force One Elite', price: 329, image: '/models/airforce1.png', brand: 'Nike', color: 'White/Silver', size: '11', model: 'Air Force One Elite' },
];

const availableBrands = ['Nike', 'Adidas', 'Jordan', 'Converse'];

// ------------------- COMPONENT -------------------
export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Hero Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.shop-hero-title',
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power4.out' }
      );
      gsap.fromTo(
        '.shop-hero-subtitle',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        '.shop-hero-badge',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.6 }
      );
      gsap.fromTo(
        '.shop-controls',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Stats counter animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.stat-number', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        innerText: (i: number, el: HTMLElement) => {
          const target = parseInt(el.getAttribute('data-target') || '0');
          return target;
        },
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power2.out',
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  // Filtering and Sorting logic
  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [searchQuery, priceRange, selectedBrands, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSearchQuery('');
    setSortBy('featured');
  };

  const activeFiltersCount = selectedBrands.length + (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0);

  // Filter Panel Component
  const FilterPanel = ({ mobile = false }) => (
    <div className={mobile ? 'p-6' : ''}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-oswald font-bold text-red-500 tracking-wide flex items-center gap-2">
          <SlidersHorizontal size={24} />
          FILTERS
        </h2>
        {mobile && (
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="text-white hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Active Filters Badge */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-semibold flex items-center gap-2"
        >
          <Sparkles size={16} />
          {activeFiltersCount} Active Filter{activeFiltersCount > 1 ? 's' : ''}
        </motion.div>
      )}

      {/* Price Range Filter */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={16} className="text-red-500" />
          Price Range
        </h3>
        <div className="space-y-4">
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20"
              style={{
                background: 'transparent',
              }}
            />
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
              style={{
                background: 'transparent',
              }}
            />
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-red-600 to-red-500"
                style={{
                  left: `${(priceRange[0] / 500) * 100}%`,
                  right: `${100 - (priceRange[1] / 500) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="px-4 py-2 bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/50 rounded-lg text-red-400 font-bold">
              ${priceRange[0]}
            </span>
            <span className="text-zinc-500 font-medium">—</span>
            <span className="px-4 py-2 bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/50 rounded-lg text-red-400 font-bold">
              ${priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Select Brands</h3>
        <div className="space-y-3">
          {availableBrands.map((brand) => {
            const count = allProducts.filter((p) => p.brand === brand).length;
            return (
              <motion.label
                key={brand}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all ${
                        selectedBrands.includes(brand)
                          ? 'bg-red-500 border-red-500 scale-110'
                          : 'border-zinc-600 group-hover:border-red-500/50'
                      }`}
                    >
                      {selectedBrands.includes(brand) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full text-white p-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <span className="text-zinc-300 group-hover:text-white transition-colors font-medium">
                    {brand}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-semibold bg-zinc-800/50 px-2 py-1 rounded">
                  {count}
                </span>
              </motion.label>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearAllFilters}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/50 hover:border-red-500 rounded-lg text-red-400 hover:text-red-300 font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
          Clear All Filters
        </motion.button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white font-montserrat relative overflow-hidden">
      {/* 3D Background Particles */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <RedParticleSystem />
        </Canvas>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid #1a1a1a;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 3px solid #1a1a1a;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
      `}</style>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          className="shop-hero-badge inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6"
          style={{ opacity: 0 }}
        >
          <Sparkles size={16} className="text-red-500" />
          <span className="text-red-400 text-sm font-semibold">Premium Collection</span>
        </motion.div>

        <motion.h1
          className="shop-hero-title text-6xl md:text-7xl lg:text-8xl font-extrabold font-oswald leading-tight tracking-tight"
          style={{ opacity: 0 }}
        >
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
            SNEAKER
          </span>
          <br />
          <span className="text-white">COLLECTION</span>
        </motion.h1>

        <motion.p
          className="shop-hero-subtitle mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light"
          style={{ opacity: 0 }}
        >
          Discover premium sneakers in stunning 3D detail. Experience the future of online shopping with interactive product visualization.
        </motion.p>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 border-y border-white/10 bg-gradient-to-b from-black to-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Products', value: allProducts.length, suffix: '+' },
            { label: 'Brands', value: availableBrands.length, suffix: '' },
            { label: 'Happy Customers', value: 1200, suffix: '+' },
            { label: 'Reviews', value: 450, suffix: '+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-red-500 font-oswald">
                <span className="stat-number" data-target={stat.value}>
                  0
                </span>
                {stat.suffix}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Controls Section */}
      <section className="shop-controls py-8 bg-black/50 backdrop-blur-sm border-b border-white/10" style={{ opacity: 0 }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
            <input
              type="text"
              placeholder="Search sneakers by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-full pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-end">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-low' | 'price-high' | 'name')}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all cursor-pointer"
            >
              <option value="featured" className="bg-zinc-900">Featured</option>
              <option value="price-low" className="bg-zinc-900">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-900">Price: High to Low</option>
              <option value="name" className="bg-zinc-900">Name: A to Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-white hover:bg-white/20'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-full transition-all ${
                  viewMode === 'list' ? 'bg-red-500 text-white' : 'text-white hover:bg-white/20'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-all"
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-white text-red-500 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-6 mt-6 text-zinc-400 text-sm flex items-center justify-between">
          <span>
            Showing <span className="text-red-500 font-semibold">{filteredProducts.length}</span> of{' '}
            <span className="text-white font-semibold">{allProducts.length}</span> sneakers
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm font-semibold underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      {/* Main Content with Left Sidebar Filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Panel */}
          <aside className="hidden lg:block lg:col-span-1 bg-gradient-to-b from-zinc-900 to-black border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/10 sticky top-24 h-fit">
            <FilterPanel />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <Search size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No sneakers found</h3>
                <p className="text-zinc-400 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <ProductGrid3D products={filteredProducts} viewMode={viewMode} />
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-zinc-900 to-black border-l border-red-500/30 z-50 overflow-y-auto lg:hidden"
            >
              <FilterPanel mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}