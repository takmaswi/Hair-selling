/**
 * Products API Route Handler (Local Version)
 * Handles product CRUD operations using local database
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filters
    const filters: any = {
      is_active: true,
      status: 'ACTIVE'
    };
    
    // Apply category filter
    const category = searchParams.get('category');
    if (category) {
      // Get category by slug
      const categories = await db.categories.findAll();
      const categoryObj = categories.find(c => c.slug === category);
      if (categoryObj) {
        filters.category_id = categoryObj.id;
      }
    }
    
    // Apply search filter
    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }
    
    // Apply featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      filters.featured = true;
    }
    
    // Get products
    let products = await db.products.findAll(filters);
    
    // Apply price filters
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Apply sorting
    const sortBy = searchParams.get('sortBy') || 'featured';
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        products.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }
    
    // Apply pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    // Get all categories for lookup
    const allCategories = await db.categories.findAll();
    
    // Add mock data for ratings and images
    const productsWithDetails = paginatedProducts.map(product => {
      const category = allCategories.find(c => c.id === product.category_id);
      return {
        ...product,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : {
          id: 'cat_default',
          name: 'Wigs',
          slug: 'wigs'
        },
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        images: [
          {
            id: `img_${product.id}_1`,
            url: `/assets/products/${product.slug}-1.jpg`,
            alt: product.name,
            display_order: 0
          }
        ],
        variants: [
          {
            id: `var_${product.id}_1`,
            name: 'Default',
            price: product.price,
            stock: product.stock || 10,
            sku: product.sku
          }
        ],
        inches: product.inches // Include inches data for filtering
      };
    });
    
    return NextResponse.json({
      products: productsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Create product
    const product = await db.products.create({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      price: body.price,
      compare_at_price: body.compareAtPrice,
      sku: body.sku,
      hair_type: body.hairType || 'HUMAN_HAIR',
      quality: body.quality || 'STANDARD',
      inches: body.inches || [],
      density: body.density || '130%',
      texture: body.texture || 'Straight',
      origin: body.origin || 'Brazilian',
      is_active: body.isActive !== undefined ? body.isActive : true,
      stock: body.stock || 0,
      status: body.status || 'ACTIVE',
      featured: body.featured || false,
      category_id: body.categoryId || 'cat_human_hair',
      seo_title: body.seoTitle,
      seo_description: body.seoDescription,
      tags: body.tags || []
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updatedProduct = await db.products.update(id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      compare_at_price: body.compareAtPrice,
      sku: body.sku,
      hair_type: body.hairType,
      quality: body.quality,
      inches: body.inches,
      density: body.density,
      texture: body.texture,
      origin: body.origin,
      is_active: body.isActive,
      stock: body.stock,
      status: body.status,
      featured: body.featured,
      category_id: body.categoryId,
      seo_title: body.seoTitle,
      seo_description: body.seoDescription,
      tags: body.tags
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const deleted = await db.products.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}