'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/account" className="hover:underline">Account</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Settings</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--truth-navy)' }}>
            Account Settings
          </h1>
          
          <div className="bg-white rounded-lg shadow-md">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--truth-magenta)]">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--truth-magenta)]">
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--truth-magenta)]">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--truth-magenta)]">
                  Preferences
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <form className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Jane" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthday">Birthday (for special offers)</Label>
                    <Input id="birthday" type="date" />
                  </div>
                  
                  <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                    Save Changes
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="security" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <form className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                    Update Security Settings
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-gray-600">
                            Receive updates about your order status
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Products</p>
                          <p className="text-sm text-gray-600">
                            Be the first to know about new arrivals
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Special Offers</p>
                          <p className="text-sm text-gray-600">
                            Exclusive deals and promotions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-gray-600">
                            Hair care tips and styling guides
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                    Save Preferences
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Shopping Preferences</h2>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select 
                      id="currency" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--truth-magenta)]"
                    >
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language" 
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--truth-magenta)]"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-4">Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Share data for personalization</p>
                          <p className="text-sm text-gray-600">
                            Help us recommend products you&apos;ll love
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Button style={{ backgroundColor: 'var(--truth-magenta)' }}>
                    Save Preferences
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>    </>
  )
}