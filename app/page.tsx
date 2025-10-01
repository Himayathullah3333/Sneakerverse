'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene3D } from '@/components/Scene3D';
import HeroSection from '@/components/HeroSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import RedThemedBrandsSection from '@/components/ui/BrandsSection';
import { AboutSection } from '@/components/AboutSection';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ weight: ['400', '700', '900'], subsets: ['latin'] });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    gsap.fromTo(
      '.parallax-bg',
      { scale: 1.2 },
      {
        scale: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.parallax-bg',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className={`min-h-screen bg-black text-white overflow-x-hidden ${poppins.className}`}>
      {/* Hero Section with 3D Scene */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0 z-10">
          <Scene3D showText={false} showParticles={false} useEnv={false} />
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <HeroSection />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        <div className="absolute inset-0 z-5 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </section>

      {/* Featured Products Section */}
      <section className="relative z-30 bg-black">
        <div className="parallax-bg">
          <FeaturedProducts />
        </div>
      </section>

      {/* Brands Section */}
      <section className="relative z-30">
        <RedThemedBrandsSection />
      </section>

    

      {/* About Section */}
      <section id="about" className="relative z-30 bg-gradient-to-b from-black via-gray-900 to-black">
        <AboutSection />
      </section>

      {/* Footer */}
      <footer className="relative z-30 bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-400">SneakerVerse</h3>
              <p className="text-gray-400">The ultimate 3D sneaker shopping experience.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/shop" className="hover:text-white transition-colors">All Sneakers</a></li>
                <li><a href="/shop?brand=nike" className="hover:text-white transition-colors">Nike</a></li>
                <li><a href="/shop?brand=adidas" className="hover:text-white transition-colors">Adidas</a></li>
                <li><a href="/shop?brand=jordan" className="hover:text-white transition-colors">Jordan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SneakerVerse. All rights reserved. Built with cutting-edge 3D technology.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
