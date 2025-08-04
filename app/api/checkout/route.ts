import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { items, customerInfo } = body

    // Calculate order totals
    const subtotal = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity)
    }, 0)
    
    const delivery = subtotal > 500 ? 0 : 25 // Free delivery over $500
    const total = subtotal + delivery // No tax for now

    // Generate order number
    const orderNumber = generateOrderNumber()
    
    // Payment method handling
    const paymentMethod = customerInfo.paymentMethod || 'cash'
    let paymentStatus = 'PENDING'
    let paymentInstructions = ''
    
    switch (paymentMethod) {
      case 'ecocash':
        paymentInstructions = `EcoCash payment prompt sent to ${customerInfo.ecocashNumber || customerInfo.phone}`
        // Here you would integrate with EcoCash API
        break
      case 'innbucks':
        paymentInstructions = `InnBucks payment prompt sent to ${customerInfo.innbucksNumber || customerInfo.phone}`
        // Here you would integrate with InnBucks API
        break
      case 'cash':
        paymentInstructions = 'Please visit our store at 123 First Street, Harare CBD to complete payment'
        break
    }

    const db = await getDb()
    const orderId = crypto.randomUUID()

    // Format addresses
    const shippingAddress = JSON.stringify({
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      line1: customerInfo.deliveryAddress.line1,
      line2: customerInfo.deliveryAddress.line2,
      city: customerInfo.deliveryAddress.city || 'Harare',
      state: customerInfo.deliveryAddress.suburb,
      postalCode: '',
      country: 'Zimbabwe',
    })

    const billingAddress = customerInfo.sameAsBilling
      ? shippingAddress
      : JSON.stringify(customerInfo.billingAddress)

    // Create order in database
    await db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, email, phone, status,
        subtotal, tax, shipping, discount, total,
        shipping_address, billing_address,
        payment_intent_id, payment_method,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      orderId,
      orderNumber,
      session?.user?.id || null,
      customerInfo.email,
      customerInfo.phone,
      paymentStatus,
      subtotal,
      0, // tax
      delivery,
      0, // discount
      total,
      shippingAddress,
      billingAddress,
      `${paymentMethod}_${orderNumber}`,
      paymentMethod
    ).run()

    // Create order items
    for (const item of items) {
      await db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, variant_id,
          quantity, price, total,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        crypto.randomUUID(),
        orderId,
        item.productId || item.id,
        item.variantId || null,
        item.quantity,
        item.price,
        item.price * item.quantity
      ).run()
    }

    return NextResponse.json({
      orderId: orderId,
      orderNumber: orderNumber,
      paymentInstructions: paymentInstructions,
      paymentMethod: paymentMethod,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}