# Truth Hair Premium Wig E-commerce Website

## ⚠️ CRITICAL: DATABASE CONFIGURATION
**THIS PROJECT USES CLOUDFLARE D1 ONLY - NO OTHER DATABASE**
- Database already exists: `truth-hair-db`
- DO NOT install or use Prisma, SQLite, PostgreSQL, or any ORM
- See `.claude/project_config.md` for full database details

## Project Overview
A fully-featured e-commerce platform for Truth Hair, specializing in premium wigs with advanced features including:
- 360° product views
- Real-time inventory management
- Stripe payment integration
- Admin dashboard
- Customer loyalty system

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **State Management**: Zustand
- **3D Graphics**: Three.js + React Three Fiber
- **Image Optimization**: Next/Image + Cloudinary
- **Animations**: Framer Motion

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Cloudflare account with D1 database
- Stripe account
- Cloudinary account (optional)

### Installation Steps

1. **Clone and Install Dependencies**
```bash
cd "Truth Hair"
npm install
```

2. **Set Up Environment Variables**
Copy `.env.local` and update with your credentials:
```bash
# Cloudflare D1
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_D1_DATABASE_ID="your-database-id"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

3. **Set Up Cloudflare D1 Database**
```bash
npx wrangler d1 create truth-hair-db
npx wrangler d1 execute truth-hair-db --file=./scripts/d1/schema.sql
npx wrangler d1 execute truth-hair-db --file=./scripts/d1/seed.sql  # Optional: adds sample data
```

4. **Run Development Server**
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure
```
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shop pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── shop/             # Shop-specific components
│   ├── product/          # Product components
│   ├── cart/             # Cart components
├── lib/                   # Utilities and hooks
├── scripts/d1/           # D1 database scripts
├── public/               # Static assets
└── types/                # TypeScript types
```

## Key Features

### 1. Product Management
- Advanced filtering (category, color, length, price)
- 360° product views using Three.js
- Quick view modals
- Wishlist functionality

### 2. Shopping Cart & Checkout
- Persistent cart using Zustand
- Guest checkout option
- Multiple payment methods via Stripe
- Order tracking

### 3. User Features
- Social login (Google)
- Order history
- Virtual consultation booking
- Loyalty points system
- Referral program

### 4. Admin Dashboard
- Product CRUD operations
- Order management
- Customer analytics
- Inventory tracking

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details

### Try-On
- `POST /api/try-on/upload` - Upload try-on image
- `GET /api/try-on/sessions` - Get user's try-on history

## Database Schema
Key tables include:
- users (customers and admins)
- products (with variants)
- orders (with items)
- reviews
- wishlists
- loyalty_points

See `scripts/d1/schema.sql` for complete schema.

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Production Checklist
- [ ] Set production database URL
- [ ] Configure Stripe webhooks
- [ ] Set up Cloudinary
- [ ] Enable email service
- [ ] Configure analytics
- [ ] Set up monitoring
- [ ] Enable CDN for assets

## Performance Optimizations
- Image lazy loading with Next/Image
- Dynamic imports for heavy components
- ISR for product pages
- Optimistic UI updates
- Bundle splitting
- Edge caching

## Security Features
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Rate limiting on API routes
- Secure payment handling

## Testing
```bash
npm run test          # Run tests
npm run test:e2e      # E2E tests
npm run lint          # Lint code
npm run type-check    # TypeScript check
```

## Maintenance Commands
```bash
npx wrangler d1 execute truth-hair-db --command="SELECT * FROM products"  # Query D1 database
npx wrangler d1 migrations apply truth-hair-db  # Apply D1 migrations
npm run build           # Production build
npm run analyze         # Bundle analysis
```

## Troubleshooting

### Common Issues
1. **Face detection not working**: Ensure models are in `public/models/`
2. **Database connection errors**: Check Cloudflare D1 credentials and wrangler.toml
3. **Stripe errors**: Verify API keys are correct
4. **Image upload issues**: Check Cloudinary configuration

### Debug Mode
Add to `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

## Support
For issues or questions:
- Check logs in development console
- Check Cloudflare D1 dashboard for database issues
- Check Next.js error boundaries
- Review browser console for client errors

## License
Private commercial project for Truth Hair.