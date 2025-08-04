"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Users, Heart, Crown } from "lucide-react";

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ customers: 0, styles: 0, satisfaction: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const finalCounts = {
    customers: 10000,
    styles: 500,
    satisfaction: 100
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounts({
        customers: Math.round(finalCounts.customers * easeOutQuart),
        styles: Math.round(finalCounts.styles * easeOutQuart),
        satisfaction: Math.round(finalCounts.satisfaction * easeOutQuart)
      });

      currentStep++;
      if (currentStep > steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  const stats = [
    {
      icon: Users,
      count: counts.customers,
      suffix: "+",
      label: "Happy Customers",
      description: "Worldwide",
      color: "var(--truth-magenta)"
    },
    {
      icon: Crown,
      count: counts.styles,
      suffix: "+",
      label: "Premium Styles",
      description: "Handcrafted",
      color: "var(--truth-gold)"
    },
    {
      icon: Heart,
      count: counts.satisfaction,
      suffix: "%",
      label: "Satisfaction Rate",
      description: "Guaranteed",
      color: "var(--truth-navy)"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--truth-navy)' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-white" />
            <h2 className="text-3xl md:text-5xl text-white" style={{ fontFamily: 'serif' }}>
              Trusted by Thousands
            </h2>
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Join a community of confident women who trust Truth Hair for their beauty transformation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="relative">
                {/* Icon Background */}
                <div 
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                    boxShadow: `0 10px 30px ${stat.color}33`
                  }}
                >
                  <stat.icon className="h-10 w-10 text-white" />
                </div>

                {/* Count */}
                <motion.div
                  className="text-4xl md:text-6xl mb-2 text-white"
                  style={{ fontFamily: 'serif' }}
                  animate={isVisible ? { scale: [0.8, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                >
                  {stat.count.toLocaleString()}{stat.suffix}
                </motion.div>

                {/* Label */}
                <h3 className="text-xl mb-2 text-white">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-white/70">
                  {stat.description}
                </p>

                {/* Decorative line */}
                <motion.div
                  className="w-12 h-1 mx-auto mt-4 rounded-full"
                  style={{ backgroundColor: stat.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-white/80 text-lg mb-6">
            Ready to join thousands of confident women?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl text-white font-medium transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, var(--truth-magenta), var(--truth-magenta)dd)`,
                boxShadow: '0 10px 30px rgba(233, 30, 140, 0.3)'
              }}
            >
              Start Your Journey
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl border-2 border-white text-white font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              View Testimonials
            </motion.button>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
}