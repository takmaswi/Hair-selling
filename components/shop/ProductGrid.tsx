'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  inches?: string[]
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

interface ProductGridProps {
  filters?: {
    categories: string[]
    colors: string[]
    lengths: string[]
    priceRange: [number, number]
    isPremium?: boolean
  }
}

export function ProductGrid({ filters }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('featured')
  const [gridView, setGridView] = useState<2 | 3 | 4>(3)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCount, setShowCount] = useState(12)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const searchParams = new URLSearchParams()
        
        // Add category filter - pass the slug directly
        if (filters?.categories && filters.categories.length > 0) {
          // Categories are already slugs from the filter component
          searchParams.append('category', filters.categories[0])
        }
        
        // Add price filters
        if (filters?.priceRange) {
          searchParams.append('minPrice', filters.priceRange[0].toString())
          searchParams.append('maxPrice', filters.priceRange[1].toString())
        }
        
        // Add premium filter
        if (filters?.isPremium) {
          searchParams.append('featured', 'true')
        }
        
        // Add sorting
        searchParams.append('sortBy', sortBy)
        searchParams.append('limit', '100') // Get more products for client-side filtering
        
        const response = await fetch(`/api/products?${searchParams}`)
        if (response.ok) {
          const data = await response.json()
          let fetchedProducts = data.products || []
          
          // Apply additional client-side filters for colors and lengths
          if (filters?.colors && filters.colors.length > 0) {
            // Filter by color (would need color data in products)
            // For now, this is placeholder logic
          }
          
          if (filters?.lengths && filters.lengths.length > 0) {
            // Filter by length based on inches
            fetchedProducts = fetchedProducts.filter((product: Product) => {
              if (!product.inches || !Array.isArray(product.inches)) return false
              return filters.lengths.some(lengthId => {
                const inches = product.inches?.map(i => parseInt(i)) || []
                switch(lengthId) {
                  case 'short':
                    return inches.some(i => i >= 8 && i <= 12)
                  case 'medium':
                    return inches.some(i => i >= 14 && i <= 18)
                  case 'long':
                    return inches.some(i => i >= 20 && i <= 24)
                  case 'extra-long':
                    return inches.some(i => i >= 26)
                  default:
                    return false
                }
              })
            })
          }
          
          setProducts(fetchedProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters, sortBy])

  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const visibleProducts = products.slice(0, showCount)
  const hasMore = showCount < products.length

  // Get active filter badges
  const getActiveFilters = () => {
    const badges = []
    if (filters?.isPremium) {
      badges.push({ label: 'Premium Collection', type: 'premium' })
    }
    if (filters?.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => {
        const category = cat.replace('-', ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        badges.push({ label: category, type: 'category' })
      })
    }
    if (filters?.colors && filters.colors.length > 0) {
      filters.colors.forEach(color => {
        const colorName = color.replace('-', ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        badges.push({ label: colorName, type: 'color' })
      })
    }
    if (filters?.lengths && filters.lengths.length > 0) {
      filters.lengths.forEach(length => {
        badges.push({ label: length.charAt(0).toUpperCase() + length.slice(1), type: 'length' })
      })
    }
    return badges
  }

  const activeFilters = getActiveFilters()

  return (
    <div>
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index}
              variant={filter.type === 'premium' ? 'default' : 'secondary'}
              className={filter.type === 'premium' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' : ''}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <p className="text-gray-600">
          {loading ? 'Loading products...' : `Showing ${Math.min(showCount, products.length)} of ${products.length} products`}
        </p>

        <div className="flex items-center gap-4">
          {/* Grid View Toggle */}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant={gridView === 2 ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setGridView(2)}
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button
              variant={gridView === 3 ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setGridView(3)}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={gridView === 4 ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setGridView(4)}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your filters.</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className={`grid ${gridClass[gridView]} gap-6`}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowCount(prev => prev + 12)}
              >
                Load More Products ({products.length - showCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}