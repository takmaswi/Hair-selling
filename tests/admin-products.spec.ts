import { test, expect } from '@playwright/test';

test.describe('Admin Products Dashboard', () => {
  test('should display products from database', async ({ page }) => {
    // Navigate to admin products page
    await page.goto('http://localhost:3002/admin/products');
    
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Check if products are displayed
    const productCards = page.locator('[class*="Card"]').filter({ hasText: /Brazilian|Peruvian|Malaysian|Kinky|Executive|Honey|Burgundy|Silky|Glueless|Glamorous|Bridal|Indian|Natural|Budget|Student|Chocolate|Trendy|Loose|Water|Zimbabwe/ });
    
    // Wait for at least one product card to be visible
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    
    // Count the number of product cards
    const count = await productCards.count();
    console.log(`Found ${count} product cards on admin dashboard`);
    
    // Verify we have products displayed
    expect(count).toBeGreaterThan(0);
    
    // Check for specific product names from our database
    await expect(page.getByText('Brazilian Deep Wave Wig')).toBeVisible({ timeout: 5000 });
    
    // Check for price display
    const priceElements = page.locator('text=/\\$[0-9]+/');
    await expect(priceElements.first()).toBeVisible();
    
    // Check for SKU display
    const skuElements = page.locator('text=/SKU: TH-/');
    await expect(skuElements.first()).toBeVisible();
  });

  test('should fetch products from API', async ({ page }) => {
    // Test the API directly
    const response = await page.request.get('http://localhost:3002/api/admin/products');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    
    console.log(`API returned ${data.data.length} products`);
    console.log('Sample product:', JSON.stringify(data.data[0], null, 2));
  });

  test('shop page should display products', async ({ page }) => {
    // Navigate to shop page
    await page.goto('http://localhost:3002/shop');
    
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Check for product grid
    const productGrid = page.locator('[class*="ProductCard"], [class*="product-card"], [class*="grid"]').first();
    await expect(productGrid).toBeVisible({ timeout: 10000 });
    
    // Check for product names
    const productNames = page.locator('h3, h4, [class*="title"], [class*="name"]').filter({ hasText: /Brazilian|Peruvian|Malaysian|Wig/ });
    await expect(productNames.first()).toBeVisible({ timeout: 10000 });
    
    const productCount = await productNames.count();
    console.log(`Found ${productCount} products on shop page`);
    expect(productCount).toBeGreaterThan(0);
  });
});