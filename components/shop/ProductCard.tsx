'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'
import { toast } from 'sonner'
import { WigPlaceholder } from '@/components/ui/wig-placeholder'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: Array<{ url: string; alt?: string }>
  category: { name: string; slug: string }
  rating: number
  reviewCount: number
  featured: boolean
  tags: string[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem, openCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
    })
    openCart()
    toast.success('Added to cart!')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
      data-testid="product-card"
    >
      <Link href={`/product/${product.slug}`}>
        <div
          className="relative overflow-hidden rounded-lg bg-gray-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.tags?.includes('premium') && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
            {product.tags?.includes('new') && (
              <Badge className="bg-navy text-white">New</Badge>
            )}
            {product.featured && (
              <Badge className="bg-magenta text-white">Featured</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">-{discountPercentage}%</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? 'fill-magenta text-magenta' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Product Image */}
          <div className="aspect-[3/4] relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <WigPlaceholder className="w-full h-full" />
            )}
            
            {/* Quick Actions Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
            >
              <Button
                size="sm"
                variant="secondary"
                className="bg-white hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="bg-magenta hover:bg-magenta/90"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-champagne text-champagne'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}