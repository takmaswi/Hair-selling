"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      age: 28,
      location: "New York, NY",
      rating: 5,
      title: "Absolutely Life-Changing!",
      review: "I never thought I could feel this confident. The quality is incredible and it looks so natural. I get compliments everywhere I go!",
      beforeImage: "/assets/good-faces-LKBuzE5A8pk-unsplash.jpg",
      afterImage: "/assets/christian-agbede-kZQNC-BGQEQ-unsplash.jpg",
      product: "Ethereal Waves - Honey Blonde",
      verifiedPurchase: true
    },
    {
      id: 2,
      name: "Maya Johnson",
      age: 35,
      location: "Los Angeles, CA",
      rating: 5,
      title: "Perfect for Special Occasions",
      review: "I bought this for my wedding and it was perfect! The quality exceeded my expectations and it looked stunning. Highly recommend!",
      beforeImage: "/assets/emmanuel-black--Rca_idmbuI-unsplash.jpg",
      afterImage: "/assets/sunber-hair-51QIf24SvIY-unsplash.jpg",
      product: "Silk Cascade - Chocolate Brown",
      verifiedPurchase: true
    },
    {
      id: 3,
      name: "Zara Williams",
      age: 24,
      location: "Miami, FL",
      rating: 5,
      title: "Amazing Customer Service",
      review: "Not only is the product amazing, but the customer service team helped me throughout the entire process. They really care about their customers.",
      beforeImage: "/assets/temitayo-olatoke-SwzA90mEb_E-unsplash.jpg",
      afterImage: "/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg",
      product: "Curly Crown - Jet Black",
      verifiedPurchase: true
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[currentTestimonial];

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--truth-blush)' }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl md:text-5xl mb-6"
            style={{ color: 'var(--truth-navy)', fontFamily: 'serif' }}
          >
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real customers who've transformed their look and confidence with Truth Hair.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Before/After Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-center mb-2">
                    <Badge variant="secondary" className="text-sm">Before</Badge>
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <ImageWithFallback
                      src={currentReview.beforeImage}
                      alt="Before photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-center mb-2">
                    <Badge 
                      className="text-sm"
                      style={{ backgroundColor: 'var(--truth-magenta)', color: 'white' }}
                    >
                      After
                    </Badge>
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <ImageWithFallback
                      src={currentReview.afterImage}
                      alt="After photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Product Badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge 
                  className="px-4 py-2 text-sm shadow-lg"
                  style={{ backgroundColor: 'var(--truth-gold)', color: 'white' }}
                >
                  {currentReview.product}
                </Badge>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="relative">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: 'var(--truth-navy)' }}
                  >
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= currentReview.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Title */}
                  <h3 
                    className="text-xl mb-4"
                    style={{ color: 'var(--truth-navy)' }}
                  >
                    {currentReview.title}
                  </h3>

                  {/* Review Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    "{currentReview.review}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={currentReview.beforeImage} />
                      <AvatarFallback>
                        {currentReview.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div 
                        className="font-semibold"
                        style={{ color: 'var(--truth-navy)' }}
                      >
                        {currentReview.name}, {currentReview.age}
                      </div>
                      <div className="text-gray-600 text-sm">{currentReview.location}</div>
                      {currentReview.verifiedPurchase && (
                        <Badge variant="outline" className="text-xs mt-1">
                          ✓ Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: 'var(--truth-navy)', color: 'var(--truth-navy)' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'w-8' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{ 
                    backgroundColor: index === currentTestimonial 
                      ? 'var(--truth-magenta)' 
                      : 'var(--truth-navy)'
                  }}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: 'var(--truth-navy)', color: 'var(--truth-navy)' }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}