import { HeroSection } from '@/components/HeroSection'
import { FeaturedCollections } from '@/components/FeaturedCollections'
import { Testimonials } from '@/components/Testimonials'
import { Header } from '@/components/Header'
import { InstagramFeed } from '@/components/home/InstagramFeed'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <HeroSection />
        <FeaturedCollections />
        <Testimonials />
        <InstagramFeed />
        <Newsletter />
      </main>
    </>
  )
}