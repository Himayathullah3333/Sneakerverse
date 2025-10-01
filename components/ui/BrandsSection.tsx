'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const brands = [
  {
    name: 'Nike',
    logo: '/models/nike.png',
    hoverColor: '#DC2626'
  },
  {
    name: 'Adidas',
    logo: '/models/Adidas.png',
    hoverColor: '#DC2626'
  },
  {
    name: 'Puma',
    logo: '/models/puma.png',
    hoverColor: '#DC2626'
  },
  {
    name: 'Reebok',
    logo: '/models/Reebok.png',
    hoverColor: '#DC2626'
  },
  {
    name: 'New Balance',
    logo: '/models/newbalance.png',
    hoverColor: '#DC2626'
  }
];

export default function RedThemedBrandsSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const brandsRef = useRef<HTMLDivElement | null>(null);

  // track which brand logos failed to load so we can show fallback text
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // animate header
            if (titleRef.current) {
              titleRef.current.style.animation =
                'slideInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both';
            }
            if (subtitleRef.current) {
              subtitleRef.current.style.animation =
                'slideInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both';
            }

            // stagger brand cards
            if (brandsRef.current) {
              const cards = brandsRef.current.querySelectorAll('.brand-card');
              cards.forEach((card, index) => {
                (card as HTMLElement).style.animation = `slideInUp 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 +
                  index * 0.08}s both`;
              });
            }
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const onLogoError = (name: string) => {
    setFailedLogos((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        :global(.brand-card) {
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 48px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        :global(.brand-card:hover) {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.15);
        }

        :global(.brand-logo) {
          filter: brightness(0) invert(1);
          transition: all 0.28s ease;
          max-width: 110px;
          width: 100%;
          height: auto;
        }

        :global(.brand-card:hover) .brand-logo {
          filter: brightness(0) invert(1);
        }

        .glass-card {
          background: rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .glass-card:hover {
          background: rgba(0, 0, 0, 0.07);
          border: 1px solid rgba(220, 38, 38, 0.22);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #fca5a5 40%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* small responsiveness tweaks */
        @media (min-width: 768px) {
          .brand-logo {
            max-width: 130px;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative py-20 px-6 overflow-hidden font-['Montserrat'] bg-gradient-to-b from-black via-red-950 to-black"
        aria-labelledby="brands-heading"
      >
        {/* subtle floating radial accents */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute top-12 left-8 w-28 h-28 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(220,38,38,0.22) 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div
            className="absolute bottom-12 right-8 w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.28) 0%, transparent 70%)',
              animation: 'float 8s ease-in-out infinite'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* header */}
          <div className="text-center mb-12">
            <div ref={titleRef} style={{ opacity: 0 }}>
              <h2
                id="brands-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Oswald'] leading-tight tracking-tight"
                style={{ lineHeight: 1 }}
              >
                TRUSTED BY
                <span className="block gradient-text">LEGENDARY BRANDS</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full mx-auto mt-5" />
            </div>

            <p
              ref={subtitleRef}
              className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mt-6 font-light"
              style={{ opacity: 0 }}
            >
              We collaborate with the world’s most iconic sneaker brands to deliver authentic
              products and next-gen experiences.
            </p>
          </div>

          {/* brands grid */}
          <div
            ref={brandsRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-center max-w-6xl mx-auto"
          >
            {brands.map((brand, index) => {
              const failed = failedLogos.has(brand.name);
              return (
                <div
                  key={brand.name}
                  className="brand-card glass-card rounded-2xl p-6 flex flex-col items-center justify-center group cursor-pointer relative overflow-hidden"
                  style={{
                    opacity: 0,
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animationDelay: `${0.6 + index * 0.08}s`
                  }}
                  aria-label={brand.name}
                >
                  {/* hover radial */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${brand.hoverColor} 0%, transparent 70%)`
                    }}
                    aria-hidden
                  />

                  {/* logo or fallback */}
                  <div className="relative z-10 flex items-center justify-center w-full h-16 md:h-20">
                    {!failed ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          fill
                          className="object-contain brand-logo"
                          sizes="(max-width: 768px) 33vw, (max-width: 1280px) 20vw, 15vw"
                          priority={false}
                          onError={() => onLogoError(brand.name) as any}
                        />
                      </div>
                    ) : (
                      <div
                        className="text-white font-semibold text-lg md:text-xl font-['Oswald']"
                        style={{ color: brand.hoverColor }}
                      >
                        {brand.name}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 text-white/70 text-sm font-medium group-hover:text-white transition-colors tracking-wide mt-4">
                    {brand.name.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </section>
    </>
  );
}
