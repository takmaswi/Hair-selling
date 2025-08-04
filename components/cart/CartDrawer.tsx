'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Add some fabulous items to get started!</p>
            <Button onClick={closeCart} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-4 border-b"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            {item.variant && (
                              <p className="text-sm text-gray-500">
                                {item.variant.color && `Color: ${item.variant.color}`}
                                {item.variant.length && ` • Length: ${item.variant.length}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Free delivery on orders over $500
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}