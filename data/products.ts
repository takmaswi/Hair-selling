export interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  color?: string
  length?: string
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
  isPremium?: boolean
  description?: string
  stock?: number
}

export const products: Product[] = [
  // Premium Collection
  {
    id: '1',
    name: 'Brazilian Lace Front Premium',
    slug: 'brazilian-lace-front-premium',
    price: 699.99,
    compareAtPrice: 899.99,
    images: ['/assets/Truth hair Instagram/527407402_1288293206259198_3681715989951022548_n.jpg'],
    category: 'lace-front',
    color: 'natural-black',
    length: 'long',
    rating: 4.9,
    reviews: 245,
    isPremium: true,
    isBestseller: true,
    description: 'Premium Brazilian hair with HD lace front, 100% virgin human hair'
  },
  {
    id: '2',
    name: 'Peruvian Body Wave Premium',
    slug: 'peruvian-body-wave-premium',
    price: 759.99,
    compareAtPrice: 959.99,
    images: ['/assets/Truth hair Instagram/527013479_1310100957218498_7778482981323467683_n.jpg'],
    category: 'full-lace',
    color: 'dark-brown',
    length: 'extra-long',
    rating: 4.9,
    reviews: 189,
    isPremium: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Malaysian Straight Premium',
    slug: 'malaysian-straight-premium',
    price: 649.99,
    images: ['/assets/Truth hair Instagram/503931177_1067516168636092_2671134672572603748_n.jpg'],
    category: 'straight',
    color: 'natural-black',
    length: 'long',
    rating: 4.8,
    reviews: 167,
    isPremium: true
  },
  {
    id: '4',
    name: 'Indian Curly Premium',
    slug: 'indian-curly-premium',
    price: 689.99,
    compareAtPrice: 789.99,
    images: ['/assets/Truth hair Instagram/503173441_17874304116354737_41983104120471362_n.jpg'],
    category: 'curly',
    color: 'dark-brown',
    length: 'medium',
    rating: 4.9,
    reviews: 203,
    isPremium: true,
    isBestseller: true
  },
  {
    id: '5',
    name: 'Cambodian Wavy Premium',
    slug: 'cambodian-wavy-premium',
    price: 729.99,
    images: ['/assets/Truth hair Instagram/502572035_1070563394482530_2263358574763842138_n.jpg'],
    category: 'wavy',
    color: 'natural-black',
    length: 'long',
    rating: 4.8,
    reviews: 156,
    isPremium: true
  },

  // Regular Collection
  {
    id: '6',
    name: 'Brazilian Lace Front Classic',
    slug: 'brazilian-lace-front-classic',
    price: 399.99,
    compareAtPrice: 499.99,
    images: ['/assets/Truth hair Instagram/502508545_1274103470801098_9089911890487168649_n.jpg'],
    category: 'lace-front',
    color: 'natural-black',
    length: 'medium',
    rating: 4.7,
    reviews: 124,
    isBestseller: true
  },
  {
    id: '7',
    name: 'Curly Bob Wig',
    slug: 'curly-bob-wig',
    price: 299.99,
    images: ['/assets/Truth hair Instagram/488465654_122134875368605377_6959154918835037015_n.jpg'],
    category: 'bob',
    color: 'dark-brown',
    length: 'short',
    rating: 4.6,
    reviews: 89,
    isNew: true
  },
  {
    id: '8',
    name: 'Long Straight Hair',
    slug: 'long-straight-hair',
    price: 449.99,
    compareAtPrice: 549.99,
    images: ['/assets/Truth hair Instagram/488331510_122134961048605377_3244505316738211867_n.jpg'],
    category: 'straight',
    color: 'natural-black',
    length: 'long',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '9',
    name: 'Wavy Beach Hair',
    slug: 'wavy-beach-hair',
    price: 359.99,
    images: ['/assets/Truth hair Instagram/486254207_122133670238605377_4000079791652634243_n.jpg'],
    category: 'wavy',
    color: 'light-brown',
    length: 'medium',
    rating: 4.5,
    reviews: 67
  },
  {
    id: '10',
    name: 'Full Lace Natural',
    slug: 'full-lace-natural',
    price: 599.99,
    images: ['/assets/Truth hair Instagram/481264554_122128938902605377_7440410147508461030_n.jpg'],
    category: 'full-lace',
    color: 'natural-black',
    length: 'long',
    rating: 4.7,
    reviews: 203
  },
  {
    id: '11',
    name: 'Burgundy Curly Wig',
    slug: 'burgundy-curly-wig',
    price: 329.99,
    compareAtPrice: 429.99,
    images: ['/assets/Truth hair Instagram/481075852_122128365044605377_1248690380413101349_n.jpg'],
    category: 'curly',
    color: 'burgundy',
    length: 'medium',
    rating: 4.6,
    reviews: 94,
    isNew: true
  },
  {
    id: '12',
    name: 'Blonde Bob Cut',
    slug: 'blonde-bob-cut',
    price: 279.99,
    images: ['/assets/Truth hair Instagram/476166254_17859032502354737_6572238023856523368_n.jpg'],
    category: 'bob',
    color: 'blonde',
    length: 'short',
    rating: 4.5,
    reviews: 72
  },
  {
    id: '13',
    name: 'Medium Brown Wavy',
    slug: 'medium-brown-wavy',
    price: 389.99,
    images: ['/assets/Truth hair Instagram/474728613_17858894403354737_3242731542854502229_n.jpg'],
    category: 'wavy',
    color: 'medium-brown',
    length: 'medium',
    rating: 4.7,
    reviews: 108
  },
  {
    id: '14',
    name: 'Natural Black Straight',
    slug: 'natural-black-straight',
    price: 419.99,
    compareAtPrice: 519.99,
    images: ['/assets/Truth hair Instagram/473051678_122121259412605377_1817856427473461036_n.jpg'],
    category: 'straight',
    color: 'natural-black',
    length: 'extra-long',
    rating: 4.8,
    reviews: 145,
    isBestseller: true
  },
  {
    id: '15',
    name: 'Curly Lace Front',
    slug: 'curly-lace-front',
    price: 459.99,
    images: ['/assets/Truth hair Instagram/473031540_17855513694354737_5030427653454768102_n.jpg'],
    category: 'lace-front',
    color: 'dark-brown',
    length: 'long',
    rating: 4.6,
    reviews: 118
  },
  {
    id: '16',
    name: 'Light Brown Bob',
    slug: 'light-brown-bob',
    price: 289.99,
    images: ['/assets/Truth hair Instagram/472205482_122120158010605377_4332545495817264116_n.jpg'],
    category: 'bob',
    color: 'light-brown',
    length: 'short',
    rating: 4.5,
    reviews: 63
  },
  {
    id: '17',
    name: 'Natural Wave Lace',
    slug: 'natural-wave-lace',
    price: 539.99,
    images: ['/assets/Truth hair Instagram/470209317_122117476778605377_315238659883376110_n.jpg'],
    category: 'lace-front',
    color: 'natural-black',
    length: 'long',
    rating: 4.7,
    reviews: 177
  },
  // Products without Instagram images (will use placeholder)
  {
    id: '18',
    name: 'Pixie Cut Style',
    slug: 'pixie-cut-style',
    price: 199.99,
    images: [],
    category: 'bob',
    color: 'natural-black',
    length: 'short',
    rating: 4.4,
    reviews: 45
  },
  {
    id: '19',
    name: 'Extra Long Straight',
    slug: 'extra-long-straight',
    price: 499.99,
    images: [],
    category: 'straight',
    color: 'natural-black',
    length: 'extra-long',
    rating: 4.6,
    reviews: 92
  },
  {
    id: '20',
    name: 'Kinky Curly Afro',
    slug: 'kinky-curly-afro',
    price: 349.99,
    images: [],
    category: 'curly',
    color: 'natural-black',
    length: 'medium',
    rating: 4.8,
    reviews: 134
  }
]

export const getFilteredProducts = (filters: {
  categories?: string[]
  colors?: string[]
  lengths?: string[]
  priceRange?: [number, number]
  isPremium?: boolean
  sortBy?: string
}) => {
  let filtered = [...products]

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories!.includes(p.category))
  }

  // Filter by colors
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(p => p.color && filters.colors!.includes(p.color))
  }

  // Filter by lengths
  if (filters.lengths && filters.lengths.length > 0) {
    filtered = filtered.filter(p => p.length && filters.lengths!.includes(p.length))
  }

  // Filter by price range
  if (filters.priceRange) {
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
    )
  }

  // Filter by premium - only filter if explicitly set to true
  if (filters.isPremium === true) {
    filtered = filtered.filter(p => p.isPremium === true)
  }

  // Sort products
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered = filtered.filter(p => p.isNew).concat(filtered.filter(p => !p.isNew))
        break
      case 'featured':
      default:
        filtered = filtered.filter(p => p.isBestseller || p.isPremium)
          .concat(filtered.filter(p => !p.isBestseller && !p.isPremium))
        break
    }
  }

  return filtered
}