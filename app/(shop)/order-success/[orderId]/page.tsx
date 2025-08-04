'use client'

import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Package, Mail, ArrowRight, Smartphone, Store, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get('method') || 'cash'
  
  const getPaymentInstructions = () => {
    switch (paymentMethod) {
      case 'ecocash':
        return {
          icon: <Smartphone className="w-6 h-6 text-green-600" />,
          title: 'EcoCash Payment',
          message: 'You will receive an EcoCash payment prompt on your registered phone number shortly.'
        }
      case 'innbucks':
        return {
          icon: <DollarSign className="w-6 h-6 text-blue-600" />,
          title: 'InnBucks Payment',
          message: 'You will receive an InnBucks payment prompt on your registered phone number shortly.'
        }
      case 'cash':
      default:
        return {
          icon: <Store className="w-6 h-6 text-orange-600" />,
          title: 'Cash Payment at Store',
          message: 'Please visit our store at 123 First Street, Harare CBD within 48 hours to complete payment.'
        }
    }
  }
  
  const paymentInfo = getPaymentInstructions()
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-playfair mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>

            <Card className="p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">#{params.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">1-2 business days (Harare)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-8 border-2 border-magenta-200 bg-magenta-50">
              <div className="flex items-start gap-4">
                {paymentInfo.icon}
                <div>
                  <h3 className="font-medium mb-1">{paymentInfo.title}</h3>
                  <p className="text-sm text-gray-600">
                    {paymentInfo.message}
                  </p>
                  {paymentMethod === 'cash' && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Store Hours:</p>
                      <p className="text-gray-600">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Package className="w-6 h-6 text-magenta flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Delivery Information</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be delivered within 1-2 business days in Harare.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-magenta flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Check Your Messages</h3>
                    <p className="text-sm text-gray-600">
                      We've sent a confirmation to your email and phone.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-blush p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {paymentMethod === 'cash' ? "Visit our store to complete payment" : "Complete payment via your mobile phone"}</li>
                <li>• We'll prepare your order for delivery</li>
                <li>• Receive your order within 1-2 business days</li>
                <li>• Contact us on WhatsApp: +263 77 123 4567 for any questions</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/shop">
                  Continue Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account/orders">View Order Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>    </>
  )
}