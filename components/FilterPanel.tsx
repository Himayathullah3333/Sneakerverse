'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClose: () => void;
}

const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

export const FilterPanel = ({
  isOpen,
  priceRange,
  onPriceRangeChange,
  onClose
}: FilterPanelProps) => {
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    onPriceRangeChange([0, 500]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:relative fixed top-0 left-0 h-full lg:h-auto w-80 lg:w-auto bg-gradient-to-br from-black/95 to-gray-900/90 backdrop-blur-md border border-red-500/30 rounded-none lg:rounded-2xl p-6 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="text-red-500" size={20} />
                <h3 className="text-xl font-bold text-white">Filters</h3>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Clear All */}
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-400 hover:text-red-300 mb-6 transition-colors"
            >
              Clear all filters
            </button>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Price Range</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 500])
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb-red"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Colors</h4>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color)
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-white/20 hover:border-red-500/40'
                    }`}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === 'black'
                          ? '#000'
                          : color.toLowerCase() === 'white'
                          ? '#fff'
                          : color.toLowerCase() === 'red'
                          ? '#ef4444'
                          : color.toLowerCase() === 'blue'
                          ? '#3b82f6'
                          : color.toLowerCase() === 'green'
                          ? '#10b981'
                          : color.toLowerCase() === 'yellow'
                          ? '#f59e0b'
                          : color.toLowerCase() === 'purple'
                          ? '#8b5cf6'
                          : '#f97316'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Size</h4>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(size => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSize(size)}
                    className={`aspect-square rounded-lg border transition-all font-medium ${
                      selectedSizes.includes(size)
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:border-red-500/50'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Static Panel */}
      <div className="hidden lg:block">
        <div className="bg-gradient-to-br from-black/90 to-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="text-red-500" size={20} />
            <h3 className="text-xl font-bold text-white">Filters</h3>
          </div>

          <button
            onClick={clearAllFilters}
            className="text-sm text-red-400 hover:text-red-300 mb-6 transition-colors"
          >
            Clear all filters
          </button>

          <div className="space-y-8">
            {/* Price Range */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Price</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
