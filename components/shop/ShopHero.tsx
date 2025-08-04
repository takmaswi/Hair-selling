'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function ShopHero() {
  // Generate consistent positions for server and client
  const particles = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      left: ((i * 37) % 100),
      top: ((i * 23) % 100),
      duration: 3 + (i % 3),
      delay: (i % 4) * 0.5
    }))
  , []);

  return (
    <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-magenta/20 to-champagne/30" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-playfair mb-4"
        >
          Shop Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto"
        >
          Discover our premium selection of handcrafted wigs designed for the modern woman
        </motion.p>
      </div>
    </section>
  )
}