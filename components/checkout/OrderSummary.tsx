'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { CartItem } from '@/lib/hooks/use-cart'
import { Truck, Shield, Tag } from 'lucide-react'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const subtotal = total
  const delivery = subtotal > 500 ? 0 : 25 // Free delivery over $500 USD
  const finalTotal = subtotal + delivery // No tax for now

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  {item.variant && (
                    <p className="text-xs text-gray-500">
                      {item.variant.color && `${item.variant.color}`}
                      {item.variant.length && ` • ${item.variant.length}`}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery (Harare)</span>
              <span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-magenta mt-0.5" />
              <div>
                <p className="font-medium text-sm">Fast Delivery</p>
                <p className="text-xs text-gray-500">1-2 days across Harare</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-magenta mt-0.5" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-gray-500">EcoCash, InnBucks & Cash</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-magenta mt-0.5" />
              <div>
                <p className="font-medium text-sm">Money Back Guarantee</p>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
              Apply
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}