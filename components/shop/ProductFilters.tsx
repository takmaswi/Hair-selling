'use client'

import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Filter, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FilterOption {
  id: string
  name: string
  count?: number
  hex?: string
  range?: [number, number]
}

interface FilterData {
  categories: FilterOption[]
  colors: FilterOption[]
  lengths: FilterOption[]
  priceRange: { min: number; max: number }
}

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    categories: string[]
    colors: string[]
    lengths: string[]
    priceRange: [number, number]
    isPremium: boolean
  }) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    colors: [],
    lengths: [],
    priceRange: { min: 0, max: 1000 }
  })
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedLengths, setSelectedLengths] = useState<string[]>([])
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/products/filters')
        if (response.ok) {
          const data = await response.json()
          setFilterData(data)
          setPriceRange([data.priceRange.min, data.priceRange.max])
        }
      } catch (error) {
        console.error('Error fetching filters:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilters()
  }, [])

  useEffect(() => {
    onFiltersChange({
      categories: selectedCategories,
      colors: selectedColors,
      lengths: selectedLengths,
      priceRange,
      isPremium
    })
  }, [selectedCategories, selectedColors, selectedLengths, priceRange, isPremium, onFiltersChange])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
  }

  const handleColorChange = (colorId: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, colorId])
    } else {
      setSelectedColors(selectedColors.filter(id => id !== colorId))
    }
  }

  const handleLengthChange = (lengthId: string, checked: boolean) => {
    if (checked) {
      setSelectedLengths([...selectedLengths, lengthId])
    } else {
      setSelectedLengths(selectedLengths.filter(id => id !== lengthId))
    }
  }

  const clearFilters = () => {
    setPriceRange([filterData.priceRange.min, filterData.priceRange.max])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedLengths([])
    setIsPremium(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      {/* Premium Selection Toggle */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-amber-600" />
            <div>
              <Label htmlFor="premium" className="text-base font-medium cursor-pointer">
                Premium Collection
              </Label>
              <p className="text-xs text-gray-600">Exclusive high-end wigs</p>
            </div>
          </div>
          <Checkbox
            id="premium"
            checked={isPremium}
            onCheckedChange={(checked) => setIsPremium(checked as boolean)}
            className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
          />
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price', 'colors', 'lengths']} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                filterData.categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-500">({category.count})</span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={filterData.priceRange.min}
                max={filterData.priceRange.max}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading colors...</p>
              ) : (
                filterData.colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={color.id}
                      checked={selectedColors.includes(color.id)}
                      onCheckedChange={(checked) => handleColorChange(color.id, checked as boolean)}
                    />
                    <Label
                      htmlFor={color.id}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lengths */}
        <AccordionItem value="lengths">
          <AccordionTrigger>Length</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading lengths...</p>
              ) : (
                filterData.lengths.map((length) => (
                  <div key={length.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={length.id}
                      checked={selectedLengths.includes(length.id)}
                      onCheckedChange={(checked) => handleLengthChange(length.id, checked as boolean)}
                    />
                    <Label
                      htmlFor={length.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {length.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}