import { NextRequest, NextResponse } from 'next/server';

// Simplified test route without database dependency
export async function GET(request: NextRequest) {
  // Return mock data for testing
  const mockProducts = [
    {
      id: 'prod_001',
      name: 'Brazilian Body Wave Wig',
      slug: 'brazilian-body-wave-wig',
      description: 'Luxurious Brazilian human hair wig with natural body wave pattern.',
      price: 299.99,
      compare_at_price: 399.99,
      sku: 'BWW-001',
      hair_type: 'HUMAN_HAIR',
      quality: 'PREMIUM',
      inches: ['12', '14', '16', '18', '20', '22'],
      density: '130%',
      texture: 'Body Wave',
      origin: 'Brazilian',
      is_active: true,
      stock: 15,
      status: 'ACTIVE',
      featured: true,
      category_id: 'cat_human_hair',
      tags: ['brazilian', 'body wave', 'human hair', 'lace front'],
      created_at: new Date(),
      updated_at: new Date(),
      category: {
        id: 'cat_human_hair',
        name: 'Human Hair Wigs',
        slug: 'human-hair-wigs'
      }
    },
    {
      id: 'prod_002',
      name: 'Straight Bob Lace Front',
      slug: 'straight-bob-lace-front',
      description: 'Chic straight bob style lace front wig.',
      price: 189.99,
      compare_at_price: 249.99,
      sku: 'SBL-001',
      hair_type: 'SYNTHETIC',
      quality: 'STANDARD',
      inches: ['10', '12', '14'],
      density: '150%',
      texture: 'Straight',
      origin: 'Synthetic',
      is_active: true,
      stock: 24,
      status: 'ACTIVE',
      featured: true,
      category_id: 'cat_lace_front',
      tags: ['bob', 'straight', 'lace front', 'synthetic'],
      created_at: new Date(),
      updated_at: new Date(),
      category: {
        id: 'cat_lace_front',
        name: 'Lace Front Wigs',
        slug: 'lace-front-wigs'
      }
    }
  ];

  return NextResponse.json({
    success: true,
    products: mockProducts,
    total: mockProducts.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create mock product
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    };

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}