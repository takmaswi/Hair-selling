'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  // Mock wishlist items for demo
  const wishlistItems = [
    {
      id: 1,
      name: 'Midnight Glamour',
      price: 449,
      originalPrice: 599,
      image: '/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg',
      inStock: true
    },
    {
      id: 2,
      name: 'Golden Sunset',
      price: 379,
      image: '/assets/bright-eliya-fPIBUqnZkCY-unsplash.jpg',
      inStock: true
    },
    {
      id: 3,
      name: 'Royal Curls',
      price: 529,
      image: '/assets/christian-agbede-4_eCQb1GA7I-unsplash.jpg',
      inStock: false
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--truth-navy)' }}>
            My Wishlist
          </h1>
          
          {wishlistItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold" style={{ color: 'var(--truth-gold)' }}>
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        style={{ backgroundColor: 'var(--truth-magenta)' }}
                        disabled={!item.inStock}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save your favorite wigs to buy them later!</p>
              <Link href="/shop">
                <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                  Explore Collection
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>    </>
  )
}