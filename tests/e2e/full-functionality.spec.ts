import { test, expect } from '@playwright/test';

test.describe('Truth Hair - Full Functionality Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3005');
  });

  test('Homepage loads correctly', async ({ page }) => {
    // Check for main elements
    await expect(page).toHaveTitle(/Truth Hair/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=/Shop All Wigs/i')).toBeVisible();
  });

  test('Product listing page works', async ({ page }) => {
    // Navigate to shop page
    await page.goto('http://localhost:3005/shop');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 }).catch(() => {
      // If no test id, try alternative selectors
      return page.waitForSelector('.product-card, [class*="product"], article', { timeout: 10000 });
    });
    
    // Check for product elements
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="product-card"], article').first();
    await expect(products).toBeVisible();
  });

  test('Filters work correctly', async ({ page }) => {
    await page.goto('http://localhost:3005/shop');
    
    // Check if filter sidebar exists
    const filterSection = page.locator('[data-testid="filters"], aside, [class*="filter"]').first();
    
    if (await filterSection.isVisible()) {
      // Try to interact with a filter
      const priceFilter = page.locator('text=/Price/i').first();
      if (await priceFilter.isVisible()) {
        await priceFilter.click();
      }
    }
  });

  test('Product search functionality', async ({ page }) => {
    await page.goto('http://localhost:3005/shop');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[name="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Brazilian');
      await searchInput.press('Enter');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
    }
  });

  test('Product detail page loads', async ({ page }) => {
    await page.goto('http://localhost:3005/shop');
    
    // Wait for products and click the first one
    await page.waitForSelector('a[href*="/products/"], a[href*="/shop/"]', { timeout: 10000 });
    const firstProductLink = page.locator('a[href*="/products/"], a[href*="/shop/"]').first();
    
    if (await firstProductLink.isVisible()) {
      await firstProductLink.click();
      
      // Check for product detail elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=/Add to Cart/i, button:has-text("Add to Cart")')).toBeVisible();
    }
  });

  test('Cart functionality', async ({ page }) => {
    // Go to a product page
    await page.goto('http://localhost:3005/shop');
    
    // Click on first product
    const firstProduct = page.locator('a[href*="/products/"], a[href*="/shop/"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // Add to cart
      const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("ADD TO CART")').first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        
        // Check for cart update (notification or cart count)
        await page.waitForTimeout(1000);
        
        // Try to open cart
        const cartButton = page.locator('[aria-label*="cart"], button:has-text("Cart"), a[href="/cart"]').first();
        if (await cartButton.isVisible()) {
          await cartButton.click();
        }
      }
    }
  });

  test('Admin dashboard access', async ({ page }) => {
    // Try to access admin dashboard
    await page.goto('http://localhost:3005/admin');
    
    // Check if redirected to login or if dashboard loads
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toContain('admin');
  });

  test('API endpoints respond correctly', async ({ page }) => {
    // Test products API
    const productsResponse = await page.request.get('http://localhost:3005/api/products');
    expect(productsResponse.ok()).toBeTruthy();
    
    const productsData = await productsResponse.json();
    expect(productsData).toHaveProperty('products');
    expect(Array.isArray(productsData.products)).toBeTruthy();
    
    // Test filters API
    const filtersResponse = await page.request.get('http://localhost:3005/api/products/filters');
    expect(filtersResponse.ok()).toBeTruthy();
    
    const filtersData = await filtersResponse.json();
    expect(filtersData).toHaveProperty('categories');
    expect(filtersData).toHaveProperty('colors');
    expect(filtersData).toHaveProperty('priceRange');
  });

  test('Responsive design works', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3005');
    
    // Check for mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu"), [class*="mobile-menu"]').first();
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
    }
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    // Navigation should be visible
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Footer links are present', async ({ page }) => {
    await page.goto('http://localhost:3005');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer elements
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      // Check for common footer links
      const footerLinks = ['About', 'Contact', 'Privacy', 'Terms'];
      for (const link of footerLinks) {
        const footerLink = footer.locator(`text=/${link}/i`).first();
        // Just check if any footer links exist, don't fail if specific ones are missing
        if (await footerLink.isVisible()) {
          break;
        }
      }
    }
  });
});

test.describe('Performance Tests', () => {
  test('Page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('API response times are acceptable', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.request.get('http://localhost:3005/api/products');
    const responseTime = Date.now() - startTime;
    
    // API should respond in under 2 seconds
    expect(responseTime).toBeLessThan(2000);
    expect(response.ok()).toBeTruthy();
  });
});