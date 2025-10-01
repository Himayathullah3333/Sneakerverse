import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';

export default function HeroSection() {
  // --- Refs ---
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const sneakerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // --- Mouse parallax ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1
        });
      }
    };
    const section = document.getElementById('hero-section');
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // --- Animations ---
  useEffect(() => {
    const animateElements = () => {
      [subtitleRef, buttonRef, sneakerRef, badgeRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.animation =
            'slideInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both';
        }
      });
    };
    const timer = setTimeout(animateElements, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 80px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotateZ(-40deg);
          }
          50% {
            transform: translateY(-60px) rotateZ(-32deg);
          }
        }

        @keyframes glow {
          0%,
          100% {
            filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))
              drop-shadow(0 20px 40px rgba(220, 38, 38, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(220, 38, 38, 0.8))
              drop-shadow(0 30px 60px rgba(220, 38, 38, 0.4));
          }
        }

        .floating-sneaker {
          animation: float 4.5s ease-in-out infinite, glow 4s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, filter;
        }

        .floating-sneaker:hover {
          transform: scale(1.1) rotateZ(-3deg) !important;
          filter: drop-shadow(0 0 60px rgba(220, 38, 38, 1))
            drop-shadow(0 40px 80px rgba(220, 38, 38, 0.6)) !important;
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #fca5a5 40%,
            #dc2626 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #ffffff; /* fallback */
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
        }

        .floating-badge {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <section
        id="hero-section"
        className="relative min-h-screen w-full overflow-hidden bg-black font-['Montserrat']"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-950" />

        {/* Dynamic Background */}
        <div
          className="parallax-bg absolute inset-0 opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${
              mousePosition.y * 5
            }px)`,
            background:
              'radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.6) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)'
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
              {/* Main Title */}
              <div ref={titleRef} className="space-y-2 opacity-100">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Oswald'] leading-tight tracking-tight">
                  <span className="block gradient-text">WELCOME TO</span>
                  <span className="block gradient-text">SNEAKERVERSE</span>
                  <span className="block gradient-text">UNLOCK YOUR STYLE</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-lg mx-auto lg:mx-0"
                style={{ opacity: 0 }}
              >
                Explore the future of sneakers, streetwear and culture. Limited
                drops. Timeless icons. Your next obsession starts here.
              </p>

              {/* CTA Button */}
              <div ref={buttonRef} style={{ opacity: 0 }} className="mt-2">
                <button
                  className="group glass-button px-10 py-4 rounded-full text-white font-bold text-lg flex items-center gap-3 mx-auto lg:mx-0"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  SHOP MORE
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isHovered ? 'translate-x-2' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right Side - Sneaker */}
            <div className="relative flex items-center justify-center">
              <div
                ref={sneakerRef}
                className="relative"
                style={{
                  opacity: 0,
                  transform: `perspective(1000px) rotateY(${
                    mousePosition.x * 3
                  }deg) rotateX(${-mousePosition.y * 3}deg)`
                }}
              >
               <img
  src="/models/nikered1.png"
  alt="Nike Red Sneaker"
  className="floating-sneaker cursor-pointer select-none max-w-none"
  style={{
    width: '900px', // increased size from 500px to 650px
    maxWidth: '90vw', // keeps it responsive on small screens
    height: 'auto',
         filter:
      'drop-shadow(0 0 25px rgba(220, 38, 38, 0.6)) drop-shadow(0 30px 60px rgba(220, 38, 38, 0.4))'
  }}
/>

              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-16 h-16 border-2 border-red-500 rounded-full opacity-60 animate-pulse" />
              <div className="absolute bottom-20 left-10 w-12 h-12 bg-red-500/30 rounded-full animate-bounce" />
            </div>
          </div>

          {/* Floating Brand Badge */}
          <div
            ref={badgeRef}
            className="floating-badge absolute bottom-10 right-10 glass-button p-6 rounded-full"
            style={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-white font-bold text-sm">10+ Brands</div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-1 h-32 bg-gradient-to-b from-red-500 to-transparent" />
          <div className="absolute top-1/3 right-20 w-24 h-1 bg-gradient-to-r from-red-500 to-transparent" />
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-red-900/30 to-transparent" />
      </section>
    </>
  );
}
