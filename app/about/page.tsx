import { Header } from '@/components/Header'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative py-20 min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/aboutus.jpg"
              alt="About Us Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl mb-8 text-white" style={{ fontFamily: 'serif' }}>
                About Truth Hair
              </h1>
              <p className="text-lg text-white/90 mb-12 leading-relaxed">
                Based in Harare, Zimbabwe, Truth Hair is your premier destination for exceptional quality wigs and hair solutions. 
                We empower women across Zimbabwe and beyond to express their unique beauty with confidence. 
                Our commitment to excellence is reflected in every strand, every style, and every satisfied customer.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Quality First</h3>
                  <p className="text-white/80">Premium materials and meticulous craftsmanship in every product</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Customer Focus</h3>
                  <p className="text-white/80">Your satisfaction and confidence are our top priorities</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Innovation</h3>
                  <p className="text-white/80">Constantly evolving to bring you the latest in hair fashion</p>
                </div>
              </div>
              
              <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left bg-white/10 backdrop-blur-sm rounded-lg p-8">
                  <h2 className="text-3xl mb-6 text-white" style={{ fontFamily: 'serif' }}>Our Story</h2>
                  <p className="text-white/80 mb-4">
                    Founded in Harare&apos;s vibrant Avondale district, Truth Hair has grown from a small boutique to Zimbabwe&apos;s most trusted name in premium wigs and hair accessories.
                    Our showroom at 228 Second Street Extension has become a destination for women seeking quality, style, and expert guidance.
                  </p>
                  <p className="text-white/80 mb-4">
                    Every product in our collection is carefully curated from the finest suppliers worldwide, ensuring our Zimbabwean customers have access to international quality and trends.
                    We believe that every woman deserves to feel confident, bold, and beautiful.
                  </p>
                  <p className="text-white/80">
                    Join thousands of satisfied customers across Zimbabwe and follow our journey on Instagram @truthhair.zw for the latest styles and exclusive offers.
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-2xl mb-4" style={{ color: 'var(--truth-magenta)' }}>Why Choose Us</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-truth-gold mr-2">✓</span>
                      100% Premium human hair and synthetic options
                    </li>
                    <li className="flex items-start">
                      <span className="text-truth-gold mr-2">✓</span>
                      Expert styling consultations available
                    </li>
                    <li className="flex items-start">
                      <span className="text-truth-gold mr-2">✓</span>
                      30-day satisfaction guarantee
                    </li>
                    <li className="flex items-start">
                      <span className="text-truth-gold mr-2">✓</span>
                      Fast, discreet delivery across Zimbabwe
                    </li>
                    <li className="flex items-start">
                      <span className="text-truth-gold mr-2">✓</span>
                      Local customer support in Harare
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>    </>
  )
}