import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products/[slug] - Get single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }
    
    // Find product by slug
    const products = await db.products.findAll();
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get category
    const categories = await db.categories.findAll();
    const category = categories.find(c => c.id === product.category_id);
    
    // Return product with additional details
    const productWithDetails = {
      ...product,
      tags: product.tags || [], // Ensure tags is always an array
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug
      } : null,
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      images: product.images || [
        {
          id: `img_${product.id}_1`,
          url: `/assets/products/${product.slug}-1.jpg`,
          alt: product.name,
          display_order: 0
        }
      ],
      variants: {
        color: product.color ? [
          { id: 'default', name: product.color }
        ] : [
          { id: 'natural-black', name: 'Natural Black', hex: '#000000' },
          { id: 'dark-brown', name: 'Dark Brown', hex: '#3B2F2F' },
          { id: 'medium-brown', name: 'Medium Brown', hex: '#6F4E37' },
        ],
        length: product.inches || ['16', '18', '20', '22'],
        density: [
          { id: '130', name: '130% (Natural)' },
          { id: '150', name: '150% (Medium)' },
          { id: '180', name: '180% (Full)' },
        ],
      },
      features: [
        product.hair_type === 'HUMAN_HAIR' ? '100% Human Hair' : 'Premium Synthetic Fiber',
        product.cap_construction || 'Lace Front Construction',
        product.pre_plucked ? 'Pre-plucked Natural Hairline' : 'Natural Hairline',
        product.baby_hair ? 'Baby Hair Along Perimeter' : 'Clean Perimeter',
        'Adjustable Elastic Band',
        product.hair_type === 'HUMAN_HAIR' ? 'Can be Styled, Colored, and Permed' : 'Heat Resistant up to 180°C',
      ]
    };
    
    return NextResponse.json(productWithDetails);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}