'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { User, Package, MapPin, Settings, Heart, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    memberSince: 'January 2024'
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/account/orders' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: Settings, label: 'Settings', href: '/account/settings' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--truth-navy)' }}>
            My Account
          </h1>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Member since {user.memberSince}
                </p>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-600">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Welcome back, {user.name}!</h2>
                <p className="text-gray-600 mb-6">
                  From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/account/orders">
                    <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer">
                      <Package className="w-8 h-8 mb-3" style={{ color: 'var(--truth-magenta)' }} />
                      <h3 className="font-semibold mb-2">Recent Orders</h3>
                      <p className="text-sm text-gray-600">View and track your orders</p>
                    </div>
                  </Link>
                  
                  <Link href="/account/addresses">
                    <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer">
                      <MapPin className="w-8 h-8 mb-3" style={{ color: 'var(--truth-magenta)' }} />
                      <h3 className="font-semibold mb-2">Shipping Addresses</h3>
                      <p className="text-sm text-gray-600">Manage your addresses</p>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Order #12345 delivered</p>
                      <p className="text-sm text-gray-600">Ethereal Waves - Chestnut Brown</p>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Added to wishlist</p>
                      <p className="text-sm text-gray-600">Midnight Glamour</p>
                    </div>
                    <span className="text-sm text-gray-500">5 days ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Profile updated</p>
                      <p className="text-sm text-gray-600">Shipping address added</p>
                    </div>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>    </>
  )
}