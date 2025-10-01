'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useParams } from 'next/navigation';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, ArrowLeft, Truck, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { Scene3D, SneakerModel } from '@/components/Scene3D';
import { useCart, Product } from '@/context/CartContext';
import RedParticleSystem from '@/components/RedParticleSystem';

// Sample product data - in a real app, this would come from an API
const productData: Record<string, Product & {
  description: string;
  features: string[];
  reviews: number;
  rating: number;
  gallery: string[];
}> = {
  '1': {
    id: '1',
    name: 'Air Max Revolution',
    price: 299,
    image: '/models/airmax.png',
    brand: 'Nike',
    color: 'Red/White',
    size: '10',
    model: 'Air Max Revolution',
    description: 'Experience the future of running with the Air Max Revolution. Featuring revolutionary air cushioning technology and premium materials for maximum comfort and style.',
    features: [
      'Revolutionary Air Max cushioning',
      'Premium leather and mesh construction',
      'Responsive rubber outsole',
      'Breathable mesh tongue',
      'Iconic Nike design language'
    ],
    reviews: 1247,
    rating: 4.8,
    gallery: ['/models/airmax.png']
  },
  '2': {
    id: '2',
    name: 'Ultra Boost 3D',
    price: 259,
    image: '/models/adidasboost.png',
    brand: 'Adidas',
    color: 'Black/Gold',
    size: '9',
    model: 'Ultra Boost 3D',
    description: 'The Ultra Boost 3D combines performance technology with street style. Features Boost midsole technology for endless energy return.',
    features: [
      'Boost midsole technology',
      'Primeknit upper for adaptive fit',
      'Continental rubber outsole',
      'Torsion system support',
      'OrthoLite sockliner'
    ],
    reviews: 892,
    rating: 4.7,
    gallery: ['/models/adidasboost.png']
  },
  '3': {
    id: '3',
    name: 'Jordan Infinity',
    price: 399,
    image: '/models/nikeinfinity.png',
    brand: 'Jordan',
    color: 'White/Blue',
    size: '11',
    model: 'Jordan Infinity',
    description: 'Experience premium comfort and futuristic design with the Jordan Infinity in a bold white/blue colorway.',
    features: [
      'Responsive midsole cushioning',
      'Breathable upper materials',
      'Durable rubber outsole',
      'Supportive heel construction',
      'Lightweight design'
    ],
    reviews: 642,
    rating: 4.6,
    gallery: ['/models/nikeinfinity.png']
  },
  '4': {
    id: '4',
    name: 'Yeezy Future',
    price: 449,
    image: '/models/yeezy.png',
    brand: 'Adidas',
    color: 'Beige/Brown',
    size: '10',
    model: 'Yeezy Future',
    description: 'Minimalist aesthetics meet advanced comfort technology in the Yeezy Future.',
    features: [
      'Cushioned midsole for all-day comfort',
      'Premium knit upper',
      'Signature minimalist styling',
      'Lightweight construction',
      'Grippy outsole pattern'
    ],
    reviews: 711,
    rating: 4.7,
    gallery: ['/models/yeezy.png']
  },
  '5': {
    id: '5',
    name: 'Chuck Taylor All-Star 3D',
    price: 159,
    image: '/models/converse.png',
    brand: 'Converse',
    color: 'Black/White',
    size: '9',
    model: 'Chuck Taylor All-Star 3D',
    description: 'The timeless Chuck Taylor silhouette reimagined for the modern era.',
    features: [
      'Classic canvas upper',
      'Vulcanized rubber sole',
      'Iconic Converse styling',
      'Breathable construction',
      'Durable toe cap'
    ],
    reviews: 520,
    rating: 4.5,
    gallery: ['/models/converse.png']
  },
  '6': {
    id: '6',
    name: 'Air Force One Elite',
    price: 329,
    image: '/models/airforce1.png',
    brand: 'Nike',
    color: 'White/Silver',
    size: '11',
    model: 'Air Force One Elite',
    description: 'An elevated take on the classic Air Force One with premium finishes.',
    features: [
      'Premium leather construction',
      'Air cushioning for support',
      'Heritage design details',
      'Durable rubber outsole',
      'Padded collar for comfort'
    ],
    reviews: 980,
    rating: 4.8,
    gallery: ['/models/airforce1.png']
  }
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = productData[productId];
  
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.size || '10');
  const [isLiked, setIsLiked] = useState(false);
    
  const heroRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      const tl = gsap.timeline();
      
      tl.fromTo('.product-hero', {
        opacity: 0,
        scale: 0.8
      }, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      })
      .fromTo('.product-details', {
        opacity: 0,
        x: 100
      }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5');

      // Floating animation for 3D model
      gsap.to('.floating-3d', {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    return () => ctx.revert();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-green-400 text-black px-6 py-3 rounded-full font-bold"
            >
              Back to Shop
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: { ...product, size: selectedSize }
      });
    }
    
    // Success animation
    gsap.fromTo('.add-to-cart-btn', {
      scale: 1
    }, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  };

  const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Background Particles */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <RedParticleSystem />
        </Canvas>
      </div>

      {/* Back Button */}
      <div className="fixed top-24 left-6 z-50">
        <Link href="/shop">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={18} />
            <span>Back to Shop</span>
          </motion.button>
        </Link>
      </div>

      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 3D Model Section */}
            <div ref={heroRef} className="product-hero relative">
              <div className="floating-3d relative aspect-square bg-gradient-to-br from-gray-900/50 to-black/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <Scene3D 
                  showText={false} 
                  showParticles={false}
                  cameraPosition={[3, 2, 5]}
                  useEnv={false}
                >
                  {/* Hide default dummy model */}
                  <></>
                </Scene3D>
                {/* Product PNG overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <Image
                    src={product.image}
                    alt={`${product.name} preview`}
                    fill
                    className="object-contain p-6"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              
              {/* Benefits Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <Truck size={20} className="text-red-400" />
                  <div>
                    <div className="text-sm font-semibold">Free Shipping</div>
                    <div className="text-xs text-gray-400">On orders over $100</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <RefreshCw size={20} className="text-red-400" />
                  <div>
                    <div className="text-sm font-semibold">30-Day Returns</div>
                    <div className="text-xs text-gray-400">Hassle-free process</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <ShieldCheck size={20} className="text-red-400" />
                  <div>
                    <div className="text-sm font-semibold">2-Year Warranty</div>
                    <div className="text-xs text-gray-400">Quality guaranteed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <Lock size={20} className="text-red-400" />
                  <div>
                    <div className="text-sm font-semibold">Secure Checkout</div>
                    <div className="text-xs text-gray-400">256-bit encryption</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div ref={detailsRef} className="product-details space-y-8">
              {/* Brand and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-medium text-lg">{product.brand}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">({product.reviews})</span>
                </div>
              </div>

              {/* Title and Price */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {product.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <span className="text-3xl font-bold text-red-400">${product.price}</span>
                  <span className="text-gray-400 line-through">${product.price + 50}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">SALE</span>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 leading-relaxed"
              >
                {product.description}
              </motion.p>

              {/* Color Display */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-white rounded-full border-2 border-red-400 shadow-lg" />
                  <span className="text-gray-300">{product.color}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-3">
                  {sizes.map(size => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`aspect-square rounded-lg border transition-all font-medium ${
                        selectedSize === size
                          ? 'bg-red-400 border-red-400 text-black'
                          : 'bg-white/10 border-white/20 text-white hover:border-red-400/50'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="px-4 py-3 font-bold">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Heart 
                      size={20} 
                      className={`transition-colors ${
                        isLiked ? 'text-red-400 fill-current' : 'text-white'
                      }`} 
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Share2 size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 10px 30px rgba(255, 0, 0, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="add-to-cart-btn flex-1 bg-gradient-to-r from-red-400 to-red-600 text-black py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-2xl transition-all duration-300"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </motion.button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

}

