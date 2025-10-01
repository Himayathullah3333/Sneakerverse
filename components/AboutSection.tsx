'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Zap, Shield, Truck } from 'lucide-react';

const features = [
  {
    icon: Box,
    title: '3D Interactive Models',
    description: 'Explore every angle with our cutting-edge 3D visualization technology.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance ensures smooth interactions across all devices.'
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your data is protected with enterprise-level security measures.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your sneakers delivered within 24-48 hours of purchase.'
  }
];

export const AboutSection = () => {
  return (
    <>
      {/* Google Fonts */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
      `}</style>

      <section className="py-20 px-6 bg-gradient-to-b from-black via-red-950 to-black font-['Montserrat']">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 font-['Oswald']"
            >
              WHY CHOOSE{' '}
              <span className="bg-gradient-to-r from-white via-red-300 to-red-600 bg-clip-text text-transparent">
                SNEAKERVERSE
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 max-w-2xl mx-auto font-['Montserrat']"
            >
              We&apos;re revolutionizing online sneaker shopping with immersive 3D technology
              and unparalleled user experience.
            </motion.p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group bg-gradient-to-br from-red-950/30 to-black/30 p-6 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-white via-red-400 to-red-600 rounded-full mb-6 mx-auto group-hover:shadow-lg group-hover:shadow-red-400/25 transition-all duration-300"
                  >
                    <IconComponent size={28} className="text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-red-400 transition-colors font-['Oswald']">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-['Montserrat']">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-red-950/30 to-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2 font-['Oswald']">1M+</div>
                <div className="text-gray-300 font-['Montserrat']">3D Models Rendered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-['Oswald']">500K+</div>
                <div className="text-gray-300 font-['Montserrat']">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-300 mb-2 font-['Oswald']">99.9%</div>
                <div className="text-gray-300 font-['Montserrat']">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2 font-['Oswald']">24/7</div>
                <div className="text-gray-300 font-['Montserrat']">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
