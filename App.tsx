"use client";

import { useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturedCollections } from "./components/FeaturedCollections";
import { Testimonials } from "./components/Testimonials";
import { HairBackground } from "./components/HairBackground";

export default function App() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // Enhanced parallax effect for multiple elements
    const handleParallax = () => {
      const scrolled = window.scrollY;
      
      // Hero background parallax
      const hero = document.querySelector('.hero-bg') as HTMLElement;
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      // Hair elements parallax is handled in HairBackground component
      
      // Add subtle parallax to section backgrounds
      const sections = document.querySelectorAll('.parallax-section');
      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const rate = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * rate}px)`;
      });
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledParallax, { passive: true });

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
      window.removeEventListener('scroll', throttledParallax);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Animated Hair Background */}
      <HairBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <FeaturedCollections />
          <Testimonials />
        </main>
      </div>
    </div>
  );
}