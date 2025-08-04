"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HairBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create flowing hair strand SVG components
  const HairStrand1 = ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 120 400" className={`w-full h-full ${className}`}>
      <defs>
        <linearGradient id={`hairGradient1-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="50%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M60 0 Q40 100 65 200 Q85 300 55 400"
        stroke={`url(#hairGradient1-${color})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <path
        d="M65 10 Q45 110 70 210 Q90 310 60 390"
        stroke={`url(#hairGradient1-${color})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );

  const HairStrand2 = ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 120 350" className={`w-full h-full ${className}`}>
      <defs>
        <linearGradient id={`hairGradient2-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M60 0 Q90 80 45 160 Q30 240 75 320 Q100 350 70 350"
        stroke={`url(#hairGradient2-${color})`}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55 5 Q85 85 40 165 Q25 245 70 325"
        stroke={`url(#hairGradient2-${color})`}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );

  const HairStrand3 = ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 120 450" className={`w-full h-full ${className}`}>
      <defs>
        <linearGradient id={`hairGradient3-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M60 0 Q35 120 80 240 Q50 360 70 450"
        stroke={`url(#hairGradient3-${color})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  // Define hair elements with enhanced visibility and animations
  const hairElements = [
    {
      Component: HairStrand1,
      color: "#E91E8C", // Magenta
      className: "",
      style: {
        position: 'absolute' as const,
        top: '5%',
        left: '2%',
        width: '80px',
        height: '300px',
        transform: `translateY(${scrollY * 0.15}px) translateX(${Math.sin(scrollY * 0.01) * 15}px) rotateZ(${Math.sin(scrollY * 0.005) * 3}deg)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand2,
      color: "#D4AF37", // Gold
      className: "",
      style: {
        position: 'absolute' as const,
        top: '15%',
        right: '5%',
        width: '100px',
        height: '250px',
        transform: `translateY(${scrollY * 0.2}px) translateX(${Math.cos(scrollY * 0.008) * 20}px) rotateZ(${Math.cos(scrollY * 0.006) * 4}deg)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand3,
      color: "#2B2D5F", // Navy
      className: "",
      style: {
        position: 'absolute' as const,
        top: '35%',
        left: '8%',
        width: '70px',
        height: '320px',
        transform: `translateY(${scrollY * 0.12}px) translateX(${Math.sin(scrollY * 0.012) * 18}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand1,
      color: "#8B4513", // Brown
      className: "",
      style: {
        position: 'absolute' as const,
        top: '50%',
        right: '12%',
        width: '90px',
        height: '220px',
        transform: `translateY(${scrollY * 0.18}px) translateX(${Math.cos(scrollY * 0.015) * 12}px) rotateZ(${Math.sin(scrollY * 0.01) * 6}deg)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand2,
      color: "#E91E8C", // Magenta
      className: "",
      style: {
        position: 'absolute' as const,
        top: '70%',
        left: '15%',
        width: '75px',
        height: '280px',
        transform: `translateY(${scrollY * 0.14}px) translateX(${Math.sin(scrollY * 0.018) * 22}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand3,
      color: "#D4AF37", // Gold
      className: "",
      style: {
        position: 'absolute' as const,
        top: '20%',
        right: '20%',
        width: '60px',
        height: '240px',
        transform: `translateY(${scrollY * 0.16}px) translateX(${Math.cos(scrollY * 0.013) * 16}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand1,
      color: "#F4A460", // Sandy Brown
      className: "",
      style: {
        position: 'absolute' as const,
        top: '65%',
        left: '65%',
        width: '85px',
        height: '300px',
        transform: `translateY(${scrollY * 0.13}px) translateX(${Math.sin(scrollY * 0.016) * 19}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand2,
      color: "#2B2D5F", // Navy
      className: "",
      style: {
        position: 'absolute' as const,
        top: '40%',
        left: '70%',
        width: '55px',
        height: '200px',
        transform: `translateY(${scrollY * 0.17}px) translateX(${Math.cos(scrollY * 0.011) * 14}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand3,
      color: "#CD853F", // Peru
      className: "",
      style: {
        position: 'absolute' as const,
        top: '10%',
        left: '40%',
        width: '65px',
        height: '260px',
        transform: `translateY(${scrollY * 0.11}px) translateX(${Math.sin(scrollY * 0.014) * 13}px)`,
        zIndex: 2
      }
    },
    {
      Component: HairStrand1,
      color: "#E91E8C", // Magenta
      className: "",
      style: {
        position: 'absolute' as const,
        top: '80%',
        right: '35%',
        width: '70px',
        height: '180px',
        transform: `translateY(${scrollY * 0.19}px) translateX(${Math.cos(scrollY * 0.017) * 17}px)`,
        zIndex: 2
      }
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {/* Main Hair Elements */}
      {hairElements.map((element, index) => (
        <motion.div
          key={`hair-${index}`}
          className={element.className}
          style={element.style}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 2, 
            delay: index * 0.2,
            ease: "easeOut"
          }}
        >
          <element.Component color={element.color} />
        </motion.div>
      ))}
      
      {/* Floating Hair Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${8 + (i % 5) * 2}px`,
              backgroundColor: i % 4 === 0 ? '#E91E8C' : i % 4 === 1 ? '#D4AF37' : i % 4 === 2 ? '#2B2D5F' : '#8B4513',
              left: `${(i * 7) % 95}%`,
              top: `${(i * 11) % 90}%`,
              opacity: 0.3 + (i % 3) * 0.2,
              transform: `translateY(${scrollY * (0.08 + (i % 4) * 0.03)}px) translateX(${Math.sin(scrollY * 0.01 + i) * 25}px) rotateZ(${Math.sin(scrollY * 0.005 + i) * 45}deg)`
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Additional Curly Hair Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`curl-${i}`}
            className="absolute"
            style={{
              left: `${(i * 13) % 90}%`,
              top: `${(i * 17) % 85}%`,
              width: '30px',
              height: '30px',
              transform: `translateY(${scrollY * (0.1 + (i % 3) * 0.04)}px) translateX(${Math.cos(scrollY * 0.008 + i) * 20}px) rotateZ(${scrollY * 0.1 + i * 20}deg)`
            }}
            animate={{
              rotateZ: [0, 360],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <circle
                cx="15"
                cy="15"
                r="3"
                fill="none"
                stroke={i % 3 === 0 ? '#E91E8C' : i % 3 === 1 ? '#D4AF37' : '#2B2D5F'}
                strokeWidth="1"
                opacity="0.4"
              />
              <path
                d="M15 12 Q18 15 15 18 Q12 15 15 12"
                fill="none"
                stroke={i % 3 === 0 ? '#E91E8C' : i % 3 === 1 ? '#D4AF37' : '#2B2D5F'}
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}