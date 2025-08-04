'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import { loadStripe } from '@stripe/stripe-js'
// import { Elements } from '@stripe/react-stripe-js'
import { Header } from '@/components/Header'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useCart } from '@/lib/hooks/use-cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotalPrice } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">
                Add some items to your cart to proceed with checkout.
              </p>
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <h1 className="text-3xl font-playfair mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <CheckoutForm
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            <div>
              <OrderSummary items={items} total={getTotalPrice()} />
            </div>
          </div>
        </div>
      </main>    </>
  )
}