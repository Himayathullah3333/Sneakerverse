'use client';

import React from 'react';
import { Poppins } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import RedParticleSystem from '@/components/RedParticleSystem';

const poppins = Poppins({ weight: ['400', '700', '900'], subsets: ['latin'] });

export default function ContactPage() {
  return (
    <main className={`min-h-screen bg-black text-white px-6 py-12 ${poppins.className} relative overflow-hidden`}>
      {/* 3D Background Particles */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <RedParticleSystem />
        </Canvas>
      </div>

      <section className="max-w-4xl mx-auto bg-gradient-to-br from-red-900 via-black to-black rounded-lg shadow-lg p-8 border border-red-700 relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Contact Us</h1>
        <p className="mb-8 text-gray-300">
          We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-red-400">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-red-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 font-semibold text-red-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Your message"
              className="w-full px-4 py-2 rounded-md bg-black border border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
