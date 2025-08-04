"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Sparkles
} from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Collections", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
        { name: "Premium Wigs", href: "#" },
        { name: "Hair Extensions", href: "#" },
        { name: "Accessories", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Size Guide", href: "#" },
        { name: "Care Instructions", href: "#" },
        { name: "Style Guide", href: "#" },
        { name: "Returns & Exchanges", href: "#" },
        { name: "Delivery Info", href: "#" },
        { name: "FAQ", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Story", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Press", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/truthhair.zw", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--truth-navy)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-white" />
                <h3 className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'serif' }}>
                  Stay In Style
                </h3>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Get exclusive access to new collections, styling tips, and special offers. 
                Join our community of confident women.
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                />
                <Button
                  className="px-8 py-2"
                  style={{ backgroundColor: 'var(--truth-magenta)' }}
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-3">
                No spam, unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2"
              >
                <div className="mb-4">
                  <Image
                    src="/assets/logo.jpg"
                    alt="Truth Hair"
                    width={150}
                    height={50}
                    className="h-12 w-auto"
                  />
                </div>
                <p className="text-white/80 mb-6 max-w-sm">
                  Zimbabwe&apos;s premier destination for premium quality wigs and hair solutions. 
                  Bold, beautiful, and ready to shine.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-white/80">
                    <Phone className="h-4 w-4" />
                    <span>+263 77 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/80">
                    <Mail className="h-4 w-4" />
                    <span>info@truthhair.zw</span>
                  </div>
                  <div className="flex items-start space-x-3 text-white/80">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>228 Second Street Extension<br />Avondale, Harare, Zimbabwe 26300</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={social.label}
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Footer Sections */}
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <h4 className="text-white text-lg mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-white/60 text-sm">
                © 2025 Truth Hair. All rights reserved.
              </div>
              
              <div className="flex flex-wrap items-center space-x-6 text-sm">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Accessibility
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Sitemap
                </a>
              </div>

              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400" />
                <span>for confident women</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}