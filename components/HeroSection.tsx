"use client";

import { Button } from "./ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRef } from "react";
import Link from "next/link";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <ImageWithFallback
          src="/assets/good-faces-LKBuzE5A8pk-unsplash.jpg"
          alt="Beautiful woman with premium wig"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        />
      </motion.div>

      {/* Floating Hair Strands */}
      <div className="absolute inset-0 z-5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              width: '2px',
              height: '60%',
              top: '-10%',
            }}
            animate={{
              y: [0, 100, 0],
              x: [0, 30, -30, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Premium Collection 2025</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
              style={{ fontFamily: 'serif' }}
            >
              Transform Your
              <span 
                className="block bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent"
              >
                Natural Beauty
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl"
            >
              Discover our premium collection of handcrafted wigs designed to enhance your confidence and express your unique style. Each piece is meticulously crafted for the modern woman who values quality and elegance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="group relative overflow-hidden px-8 py-6 text-lg rounded-2xl btn-premium"
                  style={{ 
                    backgroundColor: 'var(--truth-magenta)',
                    color: 'white'
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Shop Collections</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg rounded-2xl border-2 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/80"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-sm">Free Shipping Worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-sm">30-Day Return Policy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm">Expert Styling Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}