'use client'

import { ProductCard } from '@/components/shop/ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

// Mock related products
const mockRelatedProducts = [
  {
    id: '2',
    name: 'Silky Straight Lace Front',
    slug: 'silky-straight-lace-front',
    price: 349.99,
    images: ['/assets/emmanuel-black-k67WeAaMZAE-unsplash.jpg'],
    category: 'Lace Front Wigs',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Curly Goddess Wig',
    slug: 'curly-goddess-wig',
    price: 449.99,
    compareAtPrice: 549.99,
    images: ['/assets/good-faces-LKBuzE5A8pk-unsplash.jpg'],
    category: 'Curly Wigs',
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
  },
  {
    id: '4',
    name: 'Honey Blonde Bob',
    slug: 'honey-blonde-bob',
    price: 299.99,
    images: ['/assets/temitayo-olatoke-SwzA90mEb_E-unsplash.jpg'],
    category: 'Bob Wigs',
    rating: 4.6,
    reviews: 67,
    isNew: true,
  },
  {
    id: '5',
    name: 'Natural Black Full Lace',
    slug: 'natural-black-full-lace',
    price: 599.99,
    images: ['/assets/shedrack-salami-If2zeZ1ln3w-unsplash.jpg'],
    category: 'Full Lace Wigs',
    rating: 4.9,
    reviews: 203,
  },
]

export function RelatedProducts({ productId }: { productId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-playfair">You May Also Like</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {mockRelatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[280px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}