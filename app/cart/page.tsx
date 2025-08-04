'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingBag, Plus, Minus, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart()
  
  const subtotal = getTotalPrice()
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--truth-navy)' }}>
            Shopping Cart
          </h1>
          
          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            {item.variant && (
                              <div className="text-gray-600 text-sm">
                                {item.variant.color && <p>Color: {item.variant.color}</p>}
                                {item.variant.length && <p>Length: {item.variant.length}</p>}
                                {item.variant.density && <p>Density: {item.variant.density}</p>}
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">Have a promo code?</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter promo code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Link href="/checkout">
                    <Button
                      className="w-full mb-3"
                      style={{ backgroundColor: 'var(--truth-magenta)' }}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/shop">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some beautiful wigs to your cart!</p>
              <Link href="/shop">
                <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                  Shop Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>    </>
  )
}