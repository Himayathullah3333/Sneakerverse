'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { Scene3D, SneakerModel } from '@/components/Scene3D';

gsap.registerPlugin(ScrollTrigger);

interface ProductGrid3DProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

const Product3DCard = ({ product, index }: { product: Product; index: number }) => {
  const { dispatch } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const model3DRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(cardRef.current, {
        opacity: 0,
        y: 100,
        rotationX: -15,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Hover animations
      const tl = gsap.timeline({ paused: true });
      tl.to(cardRef.current, {
        y: -10,
        rotationX: 5,
        rotationY: 10,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)', // red glow
        duration: 0.3,
        ease: 'power2.out'
      });

      cardRef.current?.addEventListener('mouseenter', () => tl.play());
      cardRef.current?.addEventListener('mouseleave', () => tl.reverse());
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD_ITEM', payload: product });

    // Add to cart animation
    gsap.fromTo(cardRef.current, {
      scale: 1
    }, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-gradient-to-br from-black/80 to-gray-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* 3D Model Container */}
      <div ref={model3DRef} className="relative h-64 overflow-hidden">
        <Scene3D
          showText={false}
          showParticles={false}
          cameraPosition={[2, 1, 4]}
        >
          {/* Hide default dummy model */}
          <></>
        </Scene3D>

        {/* Product PNG */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 3}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>

        {/* Overlay Image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <Heart size={18} className="text-white" />
          </motion.button>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-md">
            ${product.price}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-red-400 font-medium">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">4.{Math.floor(Math.random() * 9) + 1}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{product.color}</span>
          <span>Size {product.size}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href={`/product/${product.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black/50 backdrop-blur-sm border border-red-500/30 text-red-400 py-3 rounded-lg font-medium hover:bg-red-500/20 transition-all duration-300"
            >
              View 3D Model
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white p-3 rounded-lg font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export const ProductGrid3D = ({ products, viewMode }: ProductGrid3DProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid entrance animation
      gsap.fromTo('.product-grid-container', {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👟</div>
        <h3 className="text-2xl font-bold mb-4">No Sneakers Found</h3>
        <p className="text-gray-400">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div ref={gridRef}>
      <div
        className={`product-grid-container ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
            : 'space-y-6'
        }`}
      >
        {products.map((product, index) => (
          <Product3DCard
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Load More Button */}
      {products.length >= 6 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-red-500/40 transition-all duration-300"
          >
            Load More Sneakers
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
