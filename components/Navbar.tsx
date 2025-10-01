'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Gradient */}
          <Link href="/" className="text-2xl font-bold">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-white via-red-300 to-red-600 bg-clip-text text-transparent font-extrabold"
            >
              SneakerVerse
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/#about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
              >
                <ShoppingCart size={24} />
                {state.itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {state.itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                <NavLink
                  href="/"
                  mobile
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  href="/shop"
                  mobile
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </NavLink>
                <NavLink
                  href="/#about"
                  mobile
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  href="/contact"
                  mobile
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>

                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors">
                    <ShoppingCart size={20} />
                    <span>Cart ({state.itemCount})</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

/* --- NavLink Component --- */
const NavLink = ({
  href,
  children,
  mobile = false,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}) => (
  <Link href={href} onClick={onClick}>
    <motion.span
      whileHover={{ scale: mobile ? 1 : 1.05 }}
      className="text-white hover:text-red-500 transition-colors cursor-pointer"
    >
      {children}
    </motion.span>
  </Link>
);
