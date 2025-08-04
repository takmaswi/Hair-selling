import { Header } from '@/components/Header'
import Image from 'next/image'

export default function HairCarePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="relative py-20 min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/haircare.jpg"
              alt="Hair Care Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl mb-8 text-center text-white" style={{ fontFamily: 'serif' }}>
                Hair Care Guide
              </h1>
              <p className="text-lg text-white/90 mb-12 text-center leading-relaxed">
                Learn how to maintain and care for your premium wigs to ensure they look beautiful for years to come.
              </p>
              
              <div className="space-y-12">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--truth-magenta)' }}>Daily Care</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Gently brush your wig with a wide-tooth comb</li>
                    <li>• Store on a wig stand when not in use</li>
                    <li>• Avoid excessive heat and direct sunlight</li>
                    <li>• Use specialized wig care products</li>
                  </ul>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--truth-magenta)' }}>Washing Instructions</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Wash every 6-8 wears or as needed</li>
                    <li>• Use cool water and gentle shampoo</li>
                    <li>• Pat dry with a towel, never wring</li>
                    <li>• Air dry on a wig stand</li>
                  </ul>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--truth-magenta)' }}>Styling Tips</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Use heat tools on low settings only</li>
                    <li>• Apply heat protectant before styling</li>
                    <li>• Avoid heavy products that can weigh down the hair</li>
                    <li>• Consult our experts for custom styling advice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>    </>
  )
}