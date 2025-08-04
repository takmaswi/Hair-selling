"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "@/lib/hooks/use-cart";
import { toast } from "sonner";

export function FeaturedCollections() {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const { addItem, openCart } = useCart();

  const collections = [
    {
      id: 1,
      slug: "ethereal-waves",
      name: "Ethereal Waves",
      category: "Natural Wave",
      price: 299,
      originalPrice: 399,
      rating: 4.9,
      reviews: 127,
      colors: ["#8B4513", "#D2691E", "#F4A460"],
      image: "/assets/simona-todorova-aD8jXhr3nQU-unsplash.jpg",
      badge: "Best Seller"
    },
    {
      id: 2,
      slug: "silk-cascade",
      name: "Silk Cascade",
      category: "Straight",
      price: 249,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      colors: ["#000000", "#8B4513", "#FFD700"],
      image: "/assets/lordhair-toupees-i6es-D8CImU-unsplash.jpg",
      badge: "New"
    },
    {
      id: 3,
      slug: "curly-crown",
      name: "Curly Crown",
      category: "Curly",
      price: 329,
      originalPrice: 429,
      rating: 5.0,
      reviews: 203,
      colors: ["#000000", "#8B0000", "#800080"],
      image: "/assets/christian-agbede-kZQNC-BGQEQ-unsplash.jpg",
      badge: "Premium"
    },
    {
      id: 4,
      slug: "platinum-dreams",
      name: "Platinum Dreams",
      category: "Wavy",
      price: 379,
      originalPrice: null,
      rating: 4.7,
      reviews: 156,
      colors: ["#C0C0C0", "#E6E6FA", "#F5F5DC"],
      image: "/assets/vladimir-yelizarov-0XfjLwiI1sk-unsplash.jpg",
      badge: "Limited"
    },
    {
      id: 5,
      slug: "auburn-elegance",
      name: "Auburn Elegance",
      category: "Long Layers",
      price: 289,
      originalPrice: 349,
      rating: 4.9,
      reviews: 174,
      colors: ["#A52A2A", "#CD853F", "#DEB887"],
      image: "/assets/sunber-hair-51QIf24SvIY-unsplash.jpg",
      badge: "Trending"
    },
    {
      id: 6,
      slug: "midnight-mystique",
      name: "Midnight Mystique",
      category: "Bob",
      price: 219,
      originalPrice: null,
      rating: 4.6,
      reviews: 92,
      colors: ["#000000", "#191970", "#2F4F4F"],
      image: "/assets/bright-eliya-fPIBUqnZkCY-unsplash.jpg",
      badge: "Classic"
    }
  ];

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
    toast.success(likedItems.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: String(item.id),
      productId: String(item.id),
      name: item.name,
      price: item.price,
      image: item.image,
    });
    openCart();
    toast.success('Added to cart!');
  };

  const getBadgeStyle = (badge: string) => {
    const styles = {
      "Best Seller": { backgroundColor: 'var(--truth-gold)', color: 'white' },
      "New": { backgroundColor: 'var(--truth-magenta)', color: 'white' },
      "Premium": { backgroundColor: 'var(--truth-navy)', color: 'white' },
      "Limited": { backgroundColor: 'var(--truth-black)', color: 'white' },
      "Trending": { backgroundColor: 'var(--truth-magenta)', color: 'white' },
      "Classic": { backgroundColor: 'var(--truth-silver)', color: 'var(--truth-navy)' }
    };
    return styles[badge as keyof typeof styles] || {};
  };

  return (
    <section id="collections" className="py-20 bg-white">
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
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Discover our handpicked selection of premium wigs, each crafted with the finest materials 
            and designed to make you feel absolutely stunning.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['All', 'Best Sellers', 'New Arrivals', 'Premium', 'On Sale'].map((filter) => (
              <Link href="/shop" key={filter}>
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  style={{ 
                    borderColor: 'var(--truth-navy)', 
                    color: 'var(--truth-navy)'
                  }}
                >
                  {filter}
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] card-hover-effect hover-shadow-premium">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 image-hover-zoom cursor-pointer" onClick={() => window.location.href = `/product/${item.slug}`}>
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Badge */}
                      <Badge
                        className="absolute top-4 left-4 px-3 py-1 font-medium"
                        style={getBadgeStyle(item.badge)}
                      >
                        {item.badge}
                      </Badge>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-10 h-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(item.id);
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 transition-colors ${
                              likedItems.includes(item.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-600'
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-10 h-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/product/${item.slug}`;
                          }}
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>

                      {/* Quick Shop Overlay */}
                      <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          className="w-full rounded-2xl backdrop-blur-md"
                          style={{ backgroundColor: 'var(--truth-magenta)' }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(item);
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="cursor-pointer" onClick={() => window.location.href = `/product/${item.slug}`}>
                        <h3 
                          className="font-semibold text-lg mb-1 hover:underline"
                          style={{ color: 'var(--truth-navy)' }}
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: 'var(--truth-gold)' }}
                        >
                          ${item.price}
                        </div>
                        {item.originalPrice && (
                          <div className="text-gray-500 line-through text-sm">
                            ${item.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= item.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.rating} ({item.reviews} reviews)
                      </span>
                    </div>

                    {/* Color Options */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 mr-2">Colors:</span>
                      <div className="flex space-x-2">
                        {item.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 rounded-2xl border-2"
              style={{ 
                borderColor: 'var(--truth-navy)', 
                color: 'var(--truth-navy)'
              }}
            >
              View All Collections
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}