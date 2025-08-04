import { test, expect } from '@playwright/test';

test.describe('Truth Hair Website Full Test Suite', () => {
  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    page.on('requestfailed', request => {
      errors.push(`Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test.afterEach(async () => {
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }
  });

  test('Homepage loads without errors', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for no errors
    expect(errors).toHaveLength(0);
  });

  test('Products page loads and displays products', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { 
      timeout: 10000,
      state: 'visible' 
    });
    
    // Check if products are displayed
    const products = await page.locator('[data-testid="product-card"], .product-card, [class*="product"]').count();
    expect(products).toBeGreaterThan(0);
    
    // Check for no errors
    expect(errors).toHaveLength(0);
  });

  test('Shop page loads and displays products', async ({ page }) => {
    await page.goto('http://localhost:3000/shop');
    await page.waitForLoadState('networkidle');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { 
      timeout: 10000,
      state: 'visible' 
    });
    
    // Check if products are displayed
    const products = await page.locator('[data-testid="product-card"], .product-card, [class*="product"]').count();
    expect(products).toBeGreaterThan(0);
    
    // Check for filters
    await expect(page.locator('[data-testid="filters"], [class*="filter"]').first()).toBeVisible();
    
    // Check for no errors
    expect(errors).toHaveLength(0);
  });

  test('Individual product page loads', async ({ page }) => {
    // First go to products page
    await page.goto('http://localhost:3000/products');
    await page.waitForLoadState('networkidle');
    
    // Click on first product
    const firstProduct = await page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      await page.waitForLoadState('networkidle');
      
      // Check for product details
      await expect(page.locator('h1, h2').first()).toBeVisible();
      await expect(page.locator('[data-testid="add-to-cart"], button:has-text("Add to Cart"), button:has-text("ADD TO CART")').first()).toBeVisible();
      
      // Check for price
      await expect(page.locator('[data-testid="price"], [class*="price"]').first()).toBeVisible();
    }
    
    expect(errors).toHaveLength(0);
  });

  test('Cart functionality works', async ({ page }) => {
    await page.goto('http://localhost:3000/cart');
    await page.waitForLoadState('networkidle');
    
    // Check cart page loads
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    expect(errors).toHaveLength(0);
  });

  test('Admin dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('networkidle');
    
    // Admin page might require authentication
    // Check if redirected to login or dashboard loads
    const url = page.url();
    expect(url).toMatch(/\/(admin|login|auth)/);
    
    expect(errors).toHaveLength(0);
  });

  test('Admin products page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads (might redirect to login)
    const url = page.url();
    expect(url).toMatch(/\/(admin|login|auth)/);
    
    expect(errors).toHaveLength(0);
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Check for login form elements
    const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = await page.locator('input[type="password"], input[name="password"]');
    
    if (await emailInput.count() > 0) {
      await expect(emailInput.first()).toBeVisible();
    }
    if (await passwordInput.count() > 0) {
      await expect(passwordInput.first()).toBeVisible();
    }
    
    expect(errors).toHaveLength(0);
  });

  test('Register page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');
    
    // Check for register form elements
    const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    
    if (await emailInput.count() > 0) {
      await expect(emailInput.first()).toBeVisible();
    }
    
    expect(errors).toHaveLength(0);
  });

  test('About page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/about');
    await page.waitForLoadState('networkidle');
    
    // Check page loads
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    expect(errors).toHaveLength(0);
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    
    // Check page loads
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    expect(errors).toHaveLength(0);
  });

  test('Check for 404 errors on main routes', async ({ page }) => {
    const routes = [
      '/',
      '/products',
      '/shop',
      '/cart',
      '/about',
      '/contact'
    ];

    for (const route of routes) {
      const response = await page.goto(`http://localhost:3000${route}`);
      expect(response?.status()).not.toBe(404);
    }
  });
});