'use client'

import { useState } from 'react'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { ShopHero } from '@/components/shop/ShopHero'
import { Header } from '@/components/Header'

export default function ShopPage() {
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    lengths: [],
    priceRange: [0, 1000] as [number, number]
  })

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ShopHero />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <ProductFilters onFiltersChange={setFilters} />
            </aside>
            <div className="flex-1">
              <ProductGrid filters={filters} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}