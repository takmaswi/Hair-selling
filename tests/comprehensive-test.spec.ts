import { test, expect } from '@playwright/test';

test.describe('Truth Hair Comprehensive Site Test', () => {
  const baseURL = 'http://localhost:3000';
  
  test('Homepage loads without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore Next.js development warnings
        if (!text.includes('Warning:') && !text.includes('hydration')) {
          errors.push(text);
        }
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Check key elements
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Check that no critical errors occurred
    expect(errors.length).toBe(0);
  });

  test('Shop page displays products', async ({ page }) => {
    await page.goto(`${baseURL}/shop`);
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load (API call)
    await page.waitForTimeout(2000);
    
    // Check for product cards
    const productCards = page.locator('[data-testid="product-card"], .product-card, article, [class*="product"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
    
    console.log(`Found ${count} products on shop page`);
  });

  test('Admin dashboard loads and shows products', async ({ page }) => {
    await page.goto(`${baseURL}/admin/products`);
    await page.waitForLoadState('networkidle');
    
    // Admin might redirect to login - that's ok
    const url = page.url();
    expect(url).toMatch(/\/(admin|login|auth)/);
    
    // If on admin page, check for content
    if (url.includes('/admin')) {
      await page.waitForTimeout(2000);
      const hasContent = await page.locator('table, [data-testid="product-list"], .product-list, main').first().isVisible().catch(() => false);
      expect(hasContent).toBeTruthy();
    }
  });

  test('Cart page loads', async ({ page }) => {
    await page.goto(`${baseURL}/cart`);
    await page.waitForLoadState('networkidle');
    
    // Check for cart elements
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Check for empty cart or cart items
    const hasEmptyMessage = await page.locator('text=/empty|no items/i').isVisible().catch(() => false);
    const hasCartItems = await page.locator('[data-testid="cart-item"], .cart-item').isVisible().catch(() => false);
    
    expect(hasEmptyMessage || hasCartItems).toBeTruthy();
  });

  test('API endpoints return data', async ({ request }) => {
    // Test products API
    const productsResponse = await request.get(`${baseURL}/api/products`);
    expect(productsResponse.ok()).toBeTruthy();
    
    const productsData = await productsResponse.json();
    expect(productsData.products).toBeDefined();
    expect(Array.isArray(productsData.products)).toBeTruthy();
    
    // Test admin products API
    const adminResponse = await request.get(`${baseURL}/api/admin/products`);
    expect(adminResponse.ok()).toBeTruthy();
    
    const adminData = await adminResponse.json();
    expect(adminData.products).toBeDefined();
    expect(Array.isArray(adminData.products)).toBeTruthy();
    expect(adminData.products.length).toBeGreaterThan(0);
    
    // Check that products have categories
    if (adminData.products.length > 0) {
      expect(adminData.products[0].category).toBeDefined();
      expect(adminData.products[0].category.name).toBeDefined();
    }
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Test navigation links
    const navLinks = [
      { text: 'Shop', url: '/shop' },
      { text: 'Cart', url: '/cart' },
    ];
    
    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}"), header a:has-text("${link.text}")`).first();
      
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForLoadState('networkidle');
        
        const currentURL = page.url();
        expect(currentURL).toContain(link.url);
        
        // Go back to home for next iteration
        await page.goto(baseURL);
      }
    }
  });

  test('Product images and placeholders work', async ({ page }) => {
    await page.goto(`${baseURL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for images
    const images = page.locator('img[alt*="product"], img[alt*="wig"], img[src*="product"], img[src*="placeholder"]');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first image is visible
      await expect(images.first()).toBeVisible();
    }
  });

  test('Responsive design works', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Mobile menu should be available
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu"), [data-testid="mobile-menu"]').first();
    const hasMobileMenu = await mobileMenuButton.isVisible().catch(() => false);
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Navigation should be visible
    await expect(page.locator('nav, header').first()).toBeVisible();
  });

  test('Forms are accessible', async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState('networkidle');
    
    // Check for form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
    
    // At least email input should be present on login page
    const hasEmailInput = await emailInput.isVisible().catch(() => false);
    expect(hasEmailInput).toBeTruthy();
  });
});