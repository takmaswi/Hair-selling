'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Jane Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Jane Doe',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/account" className="hover:underline">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Addresses</span>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--truth-navy)' }}>
              Shipping Addresses
            </h1>
            <Button
              onClick={() => setShowAddForm(true)}
              style={{ backgroundColor: 'var(--truth-magenta)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>
          
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Jane" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="123 Main Street" />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                
                <div className="flex space-x-3">
                  <Button type="submit" style={{ backgroundColor: 'var(--truth-magenta)' }}>
                    Save Address
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {address.isDefault && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{address.type}</h3>
                    <p className="text-sm text-gray-600">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button variant="outline" size="sm">
                        Set as Default
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>    </>
  )
}