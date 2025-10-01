'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';

gsap.registerPlugin(ScrollTrigger);

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Air Max Revolution',
    price: 299,
    image: '/models/airmax.png',
    brand: 'Nike',
    color: 'Red/White',
    size: '10',
    model: 'Air Max Revolution'
  },
  {
    id: '2',
    name: 'Ultra Boost 3D',
    price: 259,
    image: '/models/adidasboost.png',
    brand: 'Adidas',
    color: 'Black/Gold',
    size: '9',
    model: 'Ultra Boost 3D'
  },
  {
    id: '3',
    name: 'Jordan Infinity',
    price: 399,
    image: '/models/nikeinfinity.png',
    brand: 'Jordan',
    color: 'White/Blue',
    size: '11',
    model: 'Jordan Infinity'
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const { dispatch } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative bg-gradient-to-br from-red-950/50 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-500 font-['Montserrat']"
    >
      {/* IMAGE */}
      <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Favorite button */}
      <div className="absolute top-6 right-6 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Heart size={18} className="text-white" />
        </motion.button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-red-400 font-medium">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">4.8</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors font-['Oswald']">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">${product.price}</span>
          <span className="text-sm text-gray-400">{product.color}</span>
        </div>

        <div className="flex gap-2 pt-4">
          <Link href={`/product/${product.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
            >
              View Details
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-white via-red-400 to-red-600 text-black py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-['Montserrat']"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        className="py-20 px-6 bg-gradient-to-b from-black via-red-950 to-black font-['Montserrat']"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 font-['Oswald']"
            >
              FEATURED{' '}
              <span className="bg-gradient-to-r from-white via-red-300 to-red-600 bg-clip-text text-transparent">
                COLLECTION
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Discover our hand-picked selection of premium sneakers, each rendered in stunning 3D detail
              for the ultimate shopping experience.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 30px rgba(255, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-white via-red-400 to-red-600 text-black px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 font-['Montserrat']"
              >
                View All Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};
