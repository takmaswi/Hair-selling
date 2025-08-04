'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Package, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const orders = [
    {
      id: '12345',
      date: '2024-12-28',
      total: 299,
      status: 'Delivered',
      statusColor: 'text-green-600',
      items: [
        {
          name: 'Ethereal Waves',
          color: 'Chestnut Brown',
          price: 299,
          image: '/assets/simona-todorova-aD8jXhr3nQU-unsplash.jpg'
        }
      ]
    },
    {
      id: '12344',
      date: '2024-12-15',
      total: 698,
      status: 'In Transit',
      statusColor: 'text-blue-600',
      items: [
        {
          name: 'Silk Cascade',
          color: 'Jet Black',
          price: 349,
          image: '/assets/lordhair-toupees-i6es-D8CImU-unsplash.jpg'
        },
        {
          name: 'Golden Sunset',
          color: 'Honey Blonde',
          price: 349,
          image: '/assets/bright-eliya-fPIBUqnZkCY-unsplash.jpg'
        }
      ]
    },
    {
      id: '12343',
      date: '2024-11-30',
      total: 449,
      status: 'Delivered',
      statusColor: 'text-green-600',
      items: [
        {
          name: 'Midnight Glamour',
          color: 'Natural Black',
          price: 449,
          image: '/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg'
        }
      ]
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/account" className="hover:underline">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Orders</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--truth-navy)' }}>
            My Orders
          </h1>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${order.statusColor}`}>{order.status}</p>
                        <p className="text-sm text-gray-600">Total: ${order.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                          </div>
                          <p className="font-medium">${item.price}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <Button variant="outline">View Details</Button>
                      {order.status === 'Delivered' && (
                        <Button variant="outline">Leave Review</Button>
                      )}
                      {order.status === 'In Transit' && (
                        <Button variant="outline">Track Order</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
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