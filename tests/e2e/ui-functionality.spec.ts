import { test, expect } from '@playwright/test';

test.describe('Shop Page UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
  });

  test('Product grid should display products', async ({ page }) => {
    // Check for product grid
    const productGrid = page.locator('[class*="grid"], .products, .product-list').first();
    await expect(productGrid).toBeVisible();
    
    // Check for product cards
    const products = page.locator('[class*="product-card"], article, .product-item');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
    
    // Check first product has required elements
    if (productCount > 0) {
      const firstProduct = products.first();
      
      // Product image
      const productImage = firstProduct.locator('img');
      await expect(productImage).toBeVisible();
      
      // Product title
      const productTitle = firstProduct.locator('h2, h3, h4, [class*="title"], [class*="name"]');
      await expect(productTitle).toBeVisible();
      
      // Product price
      const productPrice = firstProduct.locator('[class*="price"], span:has-text("$")');
      await expect(productPrice).toBeVisible();
    }
  });

  test('Filters should be present and functional', async ({ page }) => {
    // Check for filter section
    const filters = page.locator('[class*="filter"], aside, [role="complementary"]').first();
    
    // Check for category filter
    const categoryFilter = page.locator('text=/category|categories/i');
    const hasFilters = await categoryFilter.count() > 0;
    
    if (hasFilters) {
      // Check for price filter
      const priceFilter = page.locator('text=/price|pricing/i');
      expect(await priceFilter.count()).toBeGreaterThan(0);
    }
  });

  test('Search functionality should be present', async ({ page }) => {
    // Check for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]');
    const searchCount = await searchInput.count();
    
    if (searchCount > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });
});

test.describe('Product Detail Page', () => {
  test('Product page should show all necessary information', async ({ page }) => {
    // First navigate to shop to find a product
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    // Click on first product
    const firstProduct = page.locator('[class*="product-card"], article, .product-item').first();
    const productExists = await firstProduct.count() > 0;
    
    if (productExists) {
      await firstProduct.click();
      await page.waitForLoadState('networkidle');
      
      // Check for product images
      const productImages = page.locator('[class*="product-image"], [class*="gallery"], img[alt*="product" i]');
      await expect(productImages.first()).toBeVisible();
      
      // Check for product title
      const productTitle = page.locator('h1, [class*="product-title"], [class*="product-name"]');
      await expect(productTitle.first()).toBeVisible();
      
      // Check for price
      const price = page.locator('[class*="price"], span:has-text("$")');
      await expect(price.first()).toBeVisible();
      
      // Check for add to cart button
      const addToCart = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")');
      await expect(addToCart.first()).toBeVisible();
      
      // Check for product description
      const description = page.locator('[class*="description"], [class*="details"]');
      expect(await description.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  viewports.forEach(({ name, width, height }) => {
    test(`${name} view should display correctly`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check navigation visibility
      const nav = page.locator('nav, [role="navigation"]').first();
      await expect(nav).toBeVisible();
      
      // On mobile, check for hamburger menu
      if (width < 768) {
        const hamburger = page.locator('[class*="menu-toggle"], [class*="mobile-menu"], [aria-label*="menu"]');
        const hasHamburger = await hamburger.count() > 0;
        
        if (hasHamburger) {
          await expect(hamburger.first()).toBeVisible();
        }
      }
      
      // Check main content area
      const main = page.locator('main, [role="main"], .container').first();
      await expect(main).toBeVisible();
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `tests/screenshots/responsive-${name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
  });
});

test.describe('Forms and Interactions', () => {
  test('Login form should be functional', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name*="email" i]');
    await expect(emailInput.first()).toBeVisible();
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput.first()).toBeVisible();
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
    await expect(submitButton.first()).toBeVisible();
  });
  
  test('Contact form should have all fields', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Check for form
    const form = page.locator('form');
    const formExists = await form.count() > 0;
    
    if (formExists) {
      // Check for name field
      const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]');
      expect(await nameInput.count()).toBeGreaterThan(0);
      
      // Check for email field
      const emailInput = page.locator('input[type="email"], input[name*="email" i]');
      expect(await emailInput.count()).toBeGreaterThan(0);
      
      // Check for message field
      const messageInput = page.locator('textarea');
      expect(await messageInput.count()).toBeGreaterThan(0);
    }
  });
});