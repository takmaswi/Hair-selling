'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import { useStripe, useElements, CardElement, PaymentElement } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useCart } from '@/lib/hooks/use-cart'
import { Loader2, CreditCard, User, MapPin, Smartphone, DollarSign, Store } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  
  deliveryAddress: z.object({
    line1: z.string().min(5, 'Address is required'),
    line2: z.string().optional(),
    suburb: z.string().min(2, 'Suburb is required'),
    city: z.string().default('Harare'),
    country: z.string().default('Zimbabwe'),
  }),
  
  paymentMethod: z.enum(['ecocash', 'innbucks', 'cash']),
  ecocashNumber: z.string().optional(),
  innbucksNumber: z.string().optional(),
  
  sameAsBilling: z.boolean().default(true),
  
  billingAddress: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  
  saveInfo: z.boolean().default(false),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}

export function CheckoutForm({ isProcessing, setIsProcessing }: CheckoutFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  // const stripe = useStripe()
  // const elements = useElements()
  const { items, clearCart } = useCart()
  const [activeTab, setActiveTab] = useState('info')
  const [selectedPayment, setSelectedPayment] = useState<'ecocash' | 'innbucks' | 'cash'>('ecocash')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || '',
      sameAsBilling: true,
      saveInfo: false,
      paymentMethod: 'ecocash',
    },
  })

  const sameAsBilling = watch('sameAsBilling')

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)

    try {
      // Create order
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo: {
            ...data,
            paymentMethod: selectedPayment,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId } = await response.json()

      // Clear cart and redirect to success page
      clearCart()
      
      if (selectedPayment === 'cash') {
        toast.success('Order placed! Please visit our store to complete payment.')
      } else if (selectedPayment === 'ecocash') {
        toast.success('Order placed! You will receive an EcoCash payment prompt shortly.')
      } else {
        toast.success('Order placed! You will receive an InnBucks payment prompt shortly.')
      }
      
      router.push(`/order-success/${orderId}?method=${selectedPayment}`)
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {session && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    {...register('saveInfo')}
                  />
                  <Label htmlFor="saveInfo" className="text-sm font-normal">
                    Save this information for next time
                  </Label>
                </div>
              )}

              <Button
                type="button"
                className="w-full"
                onClick={() => setActiveTab('shipping')}
              >
                Continue to Delivery
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  We currently deliver across Harare only. Delivery typically takes 1-2 business days.
                </p>
              </div>

              <div>
                <Label htmlFor="line1">Street Address</Label>
                <Input
                  id="line1"
                  {...register('deliveryAddress.line1')}
                  placeholder="123 Samora Machel Avenue"
                />
                {errors.deliveryAddress?.line1 && (
                  <p className="text-sm text-red-500 mt-1">{errors.deliveryAddress.line1.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="line2">House/Flat Number (optional)</Label>
                <Input
                  id="line2"
                  {...register('deliveryAddress.line2')}
                  placeholder="Flat 4B"
                />
              </div>

              <div>
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  {...register('deliveryAddress.suburb')}
                  placeholder="Borrowdale, Avondale, etc."
                />
                {errors.deliveryAddress?.suburb && (
                  <p className="text-sm text-red-500 mt-1">{errors.deliveryAddress.suburb.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value="Harare"
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={() => setActiveTab('payment')}
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedPayment}
                onValueChange={(value) => setSelectedPayment(value as 'ecocash' | 'innbucks' | 'cash')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="ecocash" id="ecocash" />
                  <Label htmlFor="ecocash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="font-medium">EcoCash</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay using your EcoCash mobile money wallet. You&apos;ll receive a payment prompt on your phone.
                    </p>
                    {selectedPayment === 'ecocash' && (
                      <div className="mt-3">
                        <Label htmlFor="ecocashNumber">EcoCash Number</Label>
                        <Input
                          id="ecocashNumber"
                          {...register('ecocashNumber')}
                          placeholder="0771234567"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="innbucks" id="innbucks" />
                  <Label htmlFor="innbucks" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">InnBucks</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay using InnBucks mobile money. You&apos;ll receive a payment prompt on your phone.
                    </p>
                    {selectedPayment === 'innbucks' && (
                      <div className="mt-3">
                        <Label htmlFor="innbucksNumber">InnBucks Number</Label>
                        <Input
                          id="innbucksNumber"
                          {...register('innbucksNumber')}
                          placeholder="0771234567"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">Cash at Store</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay with cash when you visit our store. Order will be reserved for 48 hours.
                    </p>
                    <div className="mt-2 p-3 bg-orange-50 rounded text-sm">
                      <p className="font-medium text-orange-900">Store Location:</p>
                      <p className="text-orange-800">123 First Street, Harare CBD</p>
                      <p className="text-orange-800">Open Mon-Sat: 8AM - 6PM</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">
                  {selectedPayment === 'cash' 
                    ? 'Your order will be reserved for 48 hours. Please bring your order confirmation when collecting.'
                    : 'You will receive a payment prompt on your mobile phone after placing the order.'
                  }
                </p>
                <p className="text-sm text-gray-600">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Order'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}