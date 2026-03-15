'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: 30, suffix: 'pp', label: 'Turnout gap: car vs. no car' },
    { number: 780, suffix: 'K', label: "Non-voters citing transport (2022)" },
    { number: 3, suffix: 'M+', label: 'Lyft rides to polls (cumulative)' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a3a5c 0%, #0f2842 40%, #1a1a2e 100%)',
      }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(194,59,34,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(91,143,199,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4">
          Interactive Research & Analysis
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          The Ride That
          <br />
          Decides Elections
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
          From church vans in the civil rights era to Uber&apos;s election day discounts, transportation to the polls has shaped who votes — and who wins. Explore the data, the history, and the impact.
        </p>

        {/* Animated Hero Stats */}
        <div className="flex flex-wrap gap-8 justify-center mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className="text-4xl md:text-5xl font-bold text-white font-variant-numeric tabular-nums"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? 'countUp 1.5s ease-out forwards' : 'none',
                  }}
                >
                  {isVisible ? stat.number : 0}
                </span>
                <span className="text-2xl font-bold text-white/60">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm text-white/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <a
          href="#statistics"
          className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Explore the Data
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
