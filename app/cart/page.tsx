'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useCart } from '@/context/CartContext';
import { Scene3D, SneakerModel } from '@/components/Scene3D';

import RedParticleSystem from '@/components/RedParticleSystem';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cart entrance animation
      gsap.fromTo('.cart-header', {
        opacity: 0,
        y: -50
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.fromTo('.cart-item', {
        opacity: 0,
        x: -100,
        scale: 0.8
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      gsap.fromTo('.cart-summary', {
        opacity: 0,
        x: 100
      }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
      });
    }, cartRef);

    return () => ctx.revert();
  }, [state.items]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    // Remove animation
    gsap.to(`.cart-item-${id}`, {
      x: -100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* 3D Background Particles */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <RedParticleSystem />
          </Canvas>
        </div>

        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="mb-8">
            <Scene3D 
              showText={false} 
              showParticles={true}
              cameraPosition={[0, 0, 8]}
            >
              <SneakerModel 
                position={[0, 0, 0]} 
                scale={1}
                animated={true}
              />
            </Scene3D>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ShoppingBag size={64} className="mx-auto text-gray-400" />
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="text-gray-400">
              Discover our amazing 3D sneaker collection and add some kicks to your cart!
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-red-700 text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main ref={cartRef} className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="cart-header pt-24 pb-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-gray-400">{state.itemCount} items in your cart</p>
            </div>
            
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={18} />
                <span>Continue Shopping</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  className={`cart-item cart-item-${item.id} bg-gradient-to-br from-gray-900/50 to-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image/3D Model */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-red-400 text-sm font-medium">{item.brand}</span>
                          <h3 className="text-xl font-bold text-white">{item.name}</h3>
                          <p className="text-gray-400">Color: {item.color}</p>
                          <p className="text-gray-400">Size: {item.size}</p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={20} />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Minus size={16} />
                          </motion.button>
                          <span className="px-4 py-2 font-bold">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                          <div className="text-sm text-gray-400">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold">${state.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-bold text-red-400">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="font-bold">${(state.total * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-red-400">
                        ${(state.total * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-black py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl transition-all duration-300 mb-4"
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </motion.button>

                <div className="text-center text-sm text-gray-400">
                  Secure checkout powered by Stripe
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      ✓
                    </div>
                    <div className="text-xs text-gray-400">Free Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      🚚
                    </div>
                    <div className="text-xs text-gray-400">Fast Shipping</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                      🔒
                    </div>
                    <div className="text-xs text-gray-400">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}