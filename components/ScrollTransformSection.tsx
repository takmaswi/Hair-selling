"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ScrollTransformSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Premium black hair styles with luxury aesthetic
  const blackHairStyles = [
    {
      id: 1,
      name: "Silk Press Elegance",
      image: "/assets/christian-agbede-4_eCQb1GA7I-unsplash.jpg",
      color: "#2B2D5F", // Truth Navy
      accentColor: "#D4AF37", // Truth Gold
      description: "Sophisticated straightened perfection",
      texture: "Silky smooth with lustrous shine"
    },
    {
      id: 2,
      name: "Natural Coils Crown",
      image: "/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg",
      color: "#0A0A0A", // Truth Black
      accentColor: "#E91E8C", // Truth Magenta
      description: "Embrace your natural texture",
      texture: "Defined coils with natural volume"
    },
    {
      id: 3,
      name: "Hollywood Waves",
      image: "/assets/emmanuel-black-k67WeAaMZAE-unsplash.jpg",
      color: "#2B2D5F", // Truth Navy
      accentColor: "#D4AF37", // Truth Gold
      description: "Old Hollywood glamour reimagined",
      texture: "Cascading waves with vintage allure"
    },
    {
      id: 4,
      name: "Protective Goddess",
      image: "/assets/shedrack-salami-If2zeZ1ln3w-unsplash.jpg",
      color: "#0A0A0A", // Truth Black
      accentColor: "#C0C0C0", // Truth Silver
      description: "Beauty meets protection",
      texture: "Intricate braided sophistication"
    },
    {
      id: 5,
      name: "Afro Chic",
      image: "/assets/temitayo-olatoke-SwzA90mEb_E-unsplash.jpg",
      color: "#E91E8C", // Truth Magenta
      accentColor: "#D4AF37", // Truth Gold
      description: "Bold, beautiful, and unapologetic",
      texture: "Full, textured crown of confidence"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      const scrollTop = window.pageYOffset;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionBottom = sectionTop + sectionHeight;
      
      if (scrollTop >= sectionTop - windowHeight && scrollTop <= sectionBottom) {
        const progress = Math.max(0, Math.min(1, 
          (scrollTop - (sectionTop - windowHeight)) / (sectionHeight + windowHeight)
        ));
        
        setScrollProgress(progress);
        
        const styleIndex = Math.floor(progress * blackHairStyles.length);
        const clampedIndex = Math.min(styleIndex, blackHairStyles.length - 1);
        setCurrentStyle(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [blackHairStyles.length]);

  const currentHairStyle = blackHairStyles[currentStyle];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden transition-all duration-1000"
      style={{ 
        background: `radial-gradient(ellipse at center, ${currentHairStyle.color}15, ${currentHairStyle.accentColor}08, var(--truth-black)05)`,
      }}
    >
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${currentHairStyle.color.slice(1)}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Premium Header */}
      <div className="relative pt-20 pb-10 text-center z-20 max-w-4xl mx-auto px-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" style={{ color: currentHairStyle.accentColor }} />
            <span 
              className="text-sm tracking-[0.3em] uppercase opacity-80"
              style={{ color: currentHairStyle.color }}
            >
              Black Hair Excellence
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" style={{ color: currentHairStyle.accentColor }} />
          </div>
          
          <h2 
            className="text-6xl md:text-8xl mb-6 tracking-tight leading-none"
            style={{ 
              color: currentHairStyle.color,
              fontFamily: 'serif',
              textShadow: `0 4px 12px ${currentHairStyle.color}20`
            }}
          >
            Crown Your Beauty
          </h2>
          
          <p 
            className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-2xl mx-auto"
            style={{ color: currentHairStyle.color }}
          >
            Experience the luxury and sophistication of our premium hair collection, crafted for exceptional quality and style
          </p>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="relative w-full max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Premium Model Showcase */}
            <div className="relative z-10">
              <div className="relative">
                {/* Main Image Frame with Luxury Border */}
                <div className="relative group">
                  <div 
                    className="aspect-[3/4] max-w-lg mx-auto relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${currentHairStyle.color}10, transparent, ${currentHairStyle.accentColor}10)`,
                    }}
                  >
                    {/* Premium Frame Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-30"
                      style={{
                        background: `linear-gradient(45deg, ${currentHairStyle.accentColor}20, transparent, ${currentHairStyle.color}20)`,
                      }}
                    />
                    
                    {/* Hair Style Images */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStyle}
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0 z-10"
                      >
                        <ImageWithFallback
                          src={currentHairStyle.image}
                          alt={currentHairStyle.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Luxury Overlay Effect */}
                    <motion.div
                      className="absolute inset-0 z-20"
                      style={{
                        background: `radial-gradient(circle at 30% 40%, ${currentHairStyle.accentColor}25, transparent 60%)`,
                      }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Subtle Hair Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={`luxury-particle-${currentStyle}-${i}`}
                          className="absolute rounded-full opacity-60"
                          style={{
                            backgroundColor: currentHairStyle.accentColor,
                            width: `${1 + (i % 2)}px`,
                            height: `${1 + (i % 2)}px`,
                            left: `${15 + (i * 5) % 70}%`,
                            top: `${10 + (i * 7) % 80}%`,
                          }}
                          animate={{
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1.5, 0.5],
                            y: [0, -20, 0],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Premium Progress Indicator */}
                  <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 hidden lg:block">
                    <div className="relative">
                      <div 
                        className="w-4 h-64 rounded-full overflow-hidden backdrop-blur-sm border"
                        style={{ 
                          backgroundColor: `${currentHairStyle.color}10`,
                          borderColor: `${currentHairStyle.accentColor}30`
                        }}
                      >
                        <motion.div
                          className="w-full rounded-full transition-all duration-500"
                          style={{
                            background: `linear-gradient(to top, ${currentHairStyle.color}, ${currentHairStyle.accentColor})`,
                            height: `${scrollProgress * 100}%`,
                            boxShadow: `0 0 15px ${currentHairStyle.accentColor}50`
                          }}
                        />
                      </div>
                      <div className="text-center mt-6">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Content Side */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStyle}
                  initial={{ opacity: 0, x: 60, y: 30 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -30, y: -15 }}
                  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-center lg:text-left"
                >
                  {/* Style Badge */}
                  <motion.div
                    className="inline-flex items-center space-x-3 mb-8"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentHairStyle.accentColor }}
                    />
                    <span 
                      className="text-sm tracking-[0.2em] uppercase border-b pb-1"
                      style={{ 
                        color: currentHairStyle.color,
                        borderColor: `${currentHairStyle.accentColor}30`
                      }}
                    >
                      Style {currentStyle + 1} of {blackHairStyles.length}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentHairStyle.accentColor }}
                    />
                  </motion.div>

                  {/* Main Title */}
                  <motion.h2 
                    className="text-5xl md:text-7xl mb-4 tracking-tight leading-none"
                    style={{ 
                      color: currentHairStyle.color,
                      fontFamily: 'serif'
                    }}
                    animate={{
                      textShadow: [
                        `0 0 0 ${currentHairStyle.color}00`,
                        `0 4px 20px ${currentHairStyle.accentColor}30`,
                        `0 0 0 ${currentHairStyle.color}00`
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {currentHairStyle.name}
                  </motion.h2>

                  {/* Description */}
                  <p 
                    className="text-2xl md:text-3xl mb-6 opacity-90 leading-relaxed"
                    style={{ color: currentHairStyle.color }}
                  >
                    {currentHairStyle.description}
                  </p>

                  {/* Texture Description */}
                  <div className="mb-8">
                    <p 
                      className="text-lg opacity-80 italic leading-relaxed"
                      style={{ color: currentHairStyle.color }}
                    >
                      {currentHairStyle.texture}
                    </p>
                  </div>

                  {/* Premium Feature List */}
                  <div className="mb-10 space-y-3">
                    {[
                      "100% Premium Human Hair",
                      "Natural Texture & Movement", 
                      "Professional Styling Ready",
                      "Long-lasting Quality"
                    ].map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: currentHairStyle.accentColor }}
                        />
                        <span 
                          className="text-base opacity-90"
                          style={{ color: currentHairStyle.color }}
                        >
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Style Navigation */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                    {blackHairStyles.map((style, index) => (
                      <motion.div
                        key={style.id}
                        className={`relative w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-700 ${
                          index === currentStyle 
                            ? 'scale-125 shadow-lg' 
                            : 'opacity-60 hover:opacity-85 hover:scale-110'
                        }`}
                        style={{ 
                          borderColor: index === currentStyle ? style.accentColor : `${style.color}40`,
                        }}
                        whileHover={{ scale: index === currentStyle ? 1.25 : 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ImageWithFallback
                          src={style.image}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                        {index === currentStyle && (
                          <motion.div
                            className="absolute inset-0 border-2 rounded-full"
                            style={{ borderColor: style.accentColor }}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Premium CTA */}
                  <motion.button
                    className="px-12 py-6 rounded-xl text-white tracking-wide uppercase text-sm transition-all duration-500 shadow-xl backdrop-blur-sm border"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentHairStyle.color}, ${currentHairStyle.color}cc)`,
                      borderColor: `${currentHairStyle.accentColor}40`,
                      boxShadow: `0 20px 40px ${currentHairStyle.color}30`
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: `0 25px 50px ${currentHairStyle.color}40`
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        `0 20px 40px ${currentHairStyle.color}30`,
                        `0 25px 50px ${currentHairStyle.color}45`,
                        `0 20px 40px ${currentHairStyle.color}30`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Experience This Style
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}