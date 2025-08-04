import { NextRequest, NextResponse } from 'next/server';
import {
  Product,
  CreateProductDto,
  AdminProductFilter,
  HairType,
  QualityLevel,
  ProductStatus,
} from '@/types/database';
import { db } from '@/lib/db';

// GET /api/admin/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filters: AdminProductFilter = {};
    
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const hair_type = searchParams.get('hair_type');
    const quality = searchParams.get('quality');
    const featured = searchParams.get('featured');
    const is_active = searchParams.get('is_active');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (hair_type) filters.hair_type = hair_type as HairType;
    if (quality) filters.quality = quality as QualityLevel;
    if (featured !== null) filters.featured = featured === 'true';
    if (is_active !== null) filters.is_active = is_active === 'true';
    if (sortBy) filters.sortBy = sortBy as any;
    if (sortOrder) filters.sortOrder = sortOrder as 'asc' | 'desc';
    
    // Get products from local database
    const products = await db.products.findAll(filters);
    const categories = await db.categories.findAll();
    
    // Add category data to products
    const productsWithCategories = products.map(product => {
      const category = categories.find(c => c.id === product.category_id);
      return {
        ...product,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug
        } : null
      };
    });
    
    return NextResponse.json({
      success: true,
      products: productsWithCategories,
      total: productsWithCategories.length
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.sku || !body.category_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create product using local database
    const newProduct = await db.products.create(body);
    
    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/admin/products - Get filter options
export async function OPTIONS(request: NextRequest) {
  try {
    // Get categories from local database
    const categories = await db.categories.findAll();
    const products = await db.products.findAll();
    
    // Get unique values for filters
    const hairTypes = [...new Set(products.map(p => p.hair_type).filter(Boolean))];
    const qualities = [...new Set(products.map(p => p.quality).filter(Boolean))];
    const textures = [...new Set(products.map(p => p.texture).filter(Boolean))];
    const origins = [...new Set(products.map(p => p.origin).filter(Boolean))];
    
    return NextResponse.json({
      success: true,
      categories,
      hairTypes,
      qualities,
      textures,
      origins,
    });
    
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const updatedProduct = await db.products.update(id, updateData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request: NextRequest) {
  try {
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
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}