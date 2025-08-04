'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--truth-navy)' }}>
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We&apos;re here to help you find your perfect style.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--truth-navy)' }}>
                Get in Touch
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+263 77 123 4567</p>
                    <p className="text-gray-600">+263 71 234 5678</p>
                    <p className="text-gray-600">Mon-Sat 8AM-6PM CAT</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@truthhair.zw</p>
                    <p className="text-gray-600">orders@truthhair.zw</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Showroom</h3>
                    <p className="text-gray-600">228 Second Street Extension</p>
                    <p className="text-gray-600">Avondale, Harare</p>
                    <p className="text-gray-600">Zimbabwe 26300</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8AM - 6PM</p>
                    <p className="text-gray-600">Saturday: 9AM - 4PM</p>
                    <p className="text-gray-600">Sunday: By Appointment</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Instagram className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Follow Us</h3>
                    <a 
                      href="https://www.instagram.com/truthhair.zw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      @truthhair.zw
                    </a>
                    <p className="text-gray-600 text-sm mt-1">See our latest styles & updates</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Visit Our Showroom</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Experience our premium collection in person. Our expert stylists are ready to help you find your perfect match.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://maps.google.com/?q=228+Second+Street+Extension+Avondale+Harare+Zimbabwe', '_blank')}
                >
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--truth-navy)' }}>
                Send us a Message
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: 'var(--truth-magenta)' }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>    </>
  )
}