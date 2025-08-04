'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Heart, ShoppingBag, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight, Camera, Rotate3D } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useCart } from '@/lib/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

// 3D Model Component
function WigModel() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}

export function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedLength, setSelectedLength] = useState('')
  const [selectedDensity, setSelectedDensity] = useState('')
  const [view3D, setView3D] = useState(false)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          // Set initial selections
          if (data.variants) {
            setSelectedColor(data.variants.color?.[0]?.id || 'default')
            setSelectedLength(data.variants.length?.[0] || '16')
            setSelectedDensity(data.variants.density?.[0]?.id || '130')
          }
        } else {
          console.error('Product not found')
          setProduct(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    
    const color = product.variants?.color?.find((c: any) => c.id === selectedColor)
    const length = typeof selectedLength === 'string' ? selectedLength : product.variants?.length?.find((l: any) => l.id === selectedLength)?.name
    const density = product.variants?.density?.find((d: any) => d.id === selectedDensity)

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.images?.[0] || '/assets/products/default.jpg',
      variant: {
        color: color?.name || product.color || 'Default',
        length: typeof length === 'string' ? `${length} inches` : length?.name,
        density: density?.name || product.density || '130%',
      },
    })
    openCart()
    toast.success('Added to cart!')
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta"></div>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </section>
    )
  }

  const discountPercentage = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  // Ensure images is an array
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [{ url: '/assets/products/default.jpg', alt: product.name }]

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
            <AnimatePresence mode="wait">
              {!view3D ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={productImages[selectedImage]?.url || productImages[selectedImage] || '/assets/products/default.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <WigModel />
                    <OrbitControls enableZoom={false} />
                  </Canvas>
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Toggle */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant={!view3D ? 'default' : 'outline'}
                onClick={() => setView3D(false)}
                className="bg-white/90 backdrop-blur"
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={view3D ? 'default' : 'outline'}
                onClick={() => setView3D(true)}
                className="bg-white/90 backdrop-blur"
              >
                <Rotate3D className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation Arrows */}
            {!view3D && productImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % productImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {!view3D && productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-magenta' : ''
                  }`}
                >
                  <Image
                    src={image.url || image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-playfair mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating || 4.5} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="flex items-center gap-2">
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
                <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600">{product.description}</p>

          {/* Variants */}
          <div className="space-y-4">
            {/* Color Selection */}
            {product.variants?.color && product.variants.color.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-2 block">Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.color.map((color: any) => (
                      <div key={color.id} className="flex items-center">
                        <RadioGroupItem
                          value={color.id}
                          id={`color-${color.id}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`color-${color.id}`}
                          className={`px-4 py-2 rounded-lg border cursor-pointer transition ${
                            selectedColor === color.id
                              ? 'border-magenta bg-magenta/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {color.hex && (
                              <div
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                            )}
                            <span>{color.name}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Length Selection */}
            {product.variants?.length && product.variants.length.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-2 block">Length</Label>
                <RadioGroup value={selectedLength} onValueChange={setSelectedLength}>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.length.map((length: any) => {
                      const lengthId = typeof length === 'string' ? length : length.id
                      const lengthName = typeof length === 'string' ? `${length} inches` : length.name
                      return (
                        <div key={lengthId} className="flex items-center">
                          <RadioGroupItem
                            value={lengthId}
                            id={`length-${lengthId}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`length-${lengthId}`}
                            className={`px-4 py-2 rounded-lg border cursor-pointer transition ${
                              selectedLength === lengthId
                                ? 'border-magenta bg-magenta/10'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {lengthName}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Density Selection */}
            {product.variants?.density && product.variants.density.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-2 block">Density</Label>
                <RadioGroup value={selectedDensity} onValueChange={setSelectedDensity}>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.density.map((density: any) => (
                      <div key={density.id} className="flex items-center">
                        <RadioGroupItem
                          value={density.id}
                          id={`density-${density.id}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`density-${density.id}`}
                          className={`px-4 py-2 rounded-lg border cursor-pointer transition ${
                            selectedDensity === density.id
                              ? 'border-magenta bg-magenta/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {density.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1 bg-magenta hover:bg-magenta/90"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 mb-2 text-magenta" />
              <span className="text-sm font-medium">Free Shipping</span>
              <span className="text-xs text-gray-500">Orders over $100</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-6 h-6 mb-2 text-magenta" />
              <span className="text-sm font-medium">Secure Payment</span>
              <span className="text-xs text-gray-500">100% Protected</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCw className="w-6 h-6 mb-2 text-magenta" />
              <span className="text-sm font-medium">Easy Returns</span>
              <span className="text-xs text-gray-500">30 Day Policy</span>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="pt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-2">
              <h3 className="font-semibold mb-2">Product Features</h3>
              <ul className="space-y-1">
                {product.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-magenta mt-1">•</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                Free standard shipping on orders over $100. Express shipping available at checkout.
                International shipping rates vary by location.
              </p>
              <p className="text-sm text-gray-600">
                Processing time: 1-2 business days. Delivery time: 3-7 business days for standard shipping.
              </p>
            </TabsContent>
            <TabsContent value="care" className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                {product.hair_type === 'HUMAN_HAIR' 
                  ? 'Gently wash with sulfate-free shampoo and conditioner. Air dry when possible. Use heat protectant when styling.'
                  : 'Gently detangle with a wide-tooth comb. Wash in cold water with mild shampoo. Air dry on a wig stand.'}
              </p>
              <p className="text-sm text-gray-600">
                Store on a wig stand or mannequin head to maintain shape. Keep away from direct heat and sunlight.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}