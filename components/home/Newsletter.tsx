'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success('Successfully subscribed to our newsletter!')
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-navy via-navy/95 to-magenta/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, ${i === 0 ? 'rgba(233, 30, 140, 0.1)' : i === 1 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(192, 192, 192, 0.1)'} 0%, transparent 70%)`,
              top: i === 0 ? '-10%' : i === 1 ? '50%' : '80%',
              left: i === 0 ? '-5%' : i === 1 ? '70%' : '30%',
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Mail className="w-8 h-8 text-champagne" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
            Stay in the Loop
          </h2>
          
          <p className="text-white/80 mb-8">
            Be the first to know about new collections, exclusive offers, and styling tips.
            Join our community of confident women!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne" />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="bg-champagne text-navy hover:bg-champagne/90 px-8"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          <p className="text-white/60 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}