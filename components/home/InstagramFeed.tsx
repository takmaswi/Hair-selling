'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Instagram } from 'lucide-react'

const instagramPosts = [
  {
    id: 1,
    image: '/assets/good-faces-LKBuzE5A8pk-unsplash.jpg',
    likes: 1234,
    caption: 'Confidence is beautiful 💫',
  },
  {
    id: 2,
    image: '/assets/temitayo-olatoke-SwzA90mEb_E-unsplash.jpg',
    likes: 987,
    caption: 'New arrivals just dropped! 🔥',
  },
  {
    id: 3,
    image: '/assets/christian-agbede-4_eCQb1GA7I-unsplash.jpg',
    likes: 2156,
    caption: 'Slay all day ✨',
  },
  {
    id: 4,
    image: '/assets/emmanuel-black-k67WeAaMZAE-unsplash.jpg',
    likes: 1789,
    caption: 'Natural beauty redefined 🌸',
  },
  {
    id: 5,
    image: '/assets/shedrack-salami-If2zeZ1ln3w-unsplash.jpg',
    likes: 1432,
    caption: 'Your style, your way 💕',
  },
  {
    id: 6,
    image: '/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg',
    likes: 2341,
    caption: 'Weekend vibes 🎉',
  },
]

export function InstagramFeed() {
  return (
    <section className="py-20 bg-blush">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-6 h-6 text-magenta" />
            <h2 className="text-3xl md:text-4xl font-playfair text-navy">
              @truthhairofficial
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community of confident women. Tag us in your photos for a chance to be featured!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium">❤️ {post.likes}</p>
                  <p className="text-xs mt-1 line-clamp-2">{post.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/truthhairofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-magenta text-white rounded-full hover:bg-magenta/90 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>Follow Us on Instagram</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}