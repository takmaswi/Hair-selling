import { Header } from '@/components/Header'

const categories = [
  {
    name: 'Lace Front Wigs',
    description: 'Natural-looking hairline with versatile styling options',
    image: '/assets/christian-agbede-kZQNC-BGQEQ-unsplash.jpg',
    count: 45
  },
  {
    name: 'Full Lace Wigs',
    description: 'Ultimate versatility with 360-degree parting',
    image: '/assets/vladimir-yelizarov-0XfjLwiI1sk-unsplash.jpg',
    count: 38
  },
  {
    name: 'Bob Wigs',
    description: 'Chic and modern short styles',
    image: '/assets/sunber-hair-51QIf24SvIY-unsplash.jpg',
    count: 32
  },
  {
    name: 'Curly Wigs',
    description: 'Beautiful curls and waves',
    image: '/assets/bright-eliya-fPIBUqnZkCY-unsplash.jpg',
    count: 28
  },
  {
    name: 'Blonde Wigs',
    description: 'Light and bright color options',
    image: '/assets/christian-agbede-4_eCQb1GA7I-unsplash.jpg',
    count: 24
  },
  {
    name: 'Custom Wigs',
    description: 'Made to order for your unique style',
    image: '/assets/osarugue-igbinoba-iEKeM1bwPlI-unsplash.jpg',
    count: 15
  }
]

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--truth-navy)' }}>
              Shop by Category
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect wig style that matches your personality and lifestyle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{category.description}</p>
                  <p className="text-sm font-medium">{category.count} Products</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>    </>
  )
}