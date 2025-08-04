import { test, expect } from '@playwright/test';

test.describe('API Functionality Tests', () => {
  const baseUrl = 'http://localhost:3005';

  test('Products API returns data', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/products`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBeTruthy();
    expect(data.products.length).toBeGreaterThan(0);
    
    // Check product structure
    if (data.products.length > 0) {
      const product = data.products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
    }
  });

  test('Filters API returns correct data', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/products/filters`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('colors');
    expect(data).toHaveProperty('lengths');
    expect(data).toHaveProperty('priceRange');
    
    // Check categories structure
    expect(Array.isArray(data.categories)).toBeTruthy();
    if (data.categories.length > 0) {
      const category = data.categories[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('count');
    }
    
    // Check price range
    expect(data.priceRange).toHaveProperty('min');
    expect(data.priceRange).toHaveProperty('max');
    expect(typeof data.priceRange.min).toBe('number');
    expect(typeof data.priceRange.max).toBe('number');
  });

  test('Products API supports pagination', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/products?page=1&limit=5`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('pagination');
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('totalPages');
    
    expect(data.products.length).toBeLessThanOrEqual(5);
  });

  test('Products API supports filtering by category', async ({ request }) => {
    // First get available categories
    const filtersResponse = await request.get(`${baseUrl}/api/products/filters`);
    const filtersData = await filtersResponse.json();
    
    if (filtersData.categories && filtersData.categories.length > 0) {
      const categorySlug = filtersData.categories[0].id;
      
      const response = await request.get(`${baseUrl}/api/products?category=${categorySlug}`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('products');
    }
  });

  test('Products API supports search', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/products?search=Brazilian`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('products');
    
    // Check if search term appears in results
    if (data.products.length > 0) {
      const hasSearchTerm = data.products.some(p => 
        p.name.toLowerCase().includes('brazilian') || 
        p.description.toLowerCase().includes('brazilian')
      );
      expect(hasSearchTerm).toBeTruthy();
    }
  });

  test('Products API supports sorting', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/products?sortBy=price-asc`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('products');
    
    // Check if products are sorted by price ascending
    if (data.products.length > 1) {
      for (let i = 1; i < data.products.length; i++) {
        expect(data.products[i].price).toBeGreaterThanOrEqual(data.products[i-1].price);
      }
    }
  });

  test('Admin products API returns data', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/admin/products`);
    
    // Admin route might require authentication, so we check for either success or auth error
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('products');
    } else {
      // If it fails, it should be an auth error
      expect([401, 403]).toContain(response.status());
    }
  });
});