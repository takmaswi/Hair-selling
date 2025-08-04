import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/shop', name: 'Shop' },
  { path: '/categories', name: 'Categories' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/cart', name: 'Cart' },
  { path: '/wishlist', name: 'Wishlist' },
  { path: '/account', name: 'Account' },
  { path: '/account/orders', name: 'Orders' },
  { path: '/account/addresses', name: 'Addresses' },
  { path: '/account/settings', name: 'Settings' },
];

test.describe('Blank Page Detection', () => {
  routes.forEach(({ path, name }) => {
    test(`${name} page should not be blank`, async ({ page }) => {
      // Navigate to the page with proper timeout
      const response = await page.goto(path, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Check response status
      expect(response?.status()).toBeLessThan(400);
      
      // Wait for page to load completely
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      
      // Wait for body to have content
      await page.waitForSelector('body', { state: 'attached' });
      
      // Check if page has content
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toBe('');
      expect(bodyText?.trim().length).toBeGreaterThan(10);
      
      // Check for common UI elements with better selectors
      const hasContent = await page.locator('main, [role="main"], .container, div[id="__next"], div[class*="app"], div[class*="App"]').count();
      expect(hasContent).toBeGreaterThan(0);
      
      // Check that page is not showing error
      const errorMessages = await page.locator('text=/error|404|not found|page not found|something went wrong/i').count();
      expect(errorMessages).toBe(0);
      
      // Ensure page has rendered content
      const visibleText = await page.evaluate(() => {
        const element = document.body;
        return element && element.innerText ? element.innerText.trim() : '';
      });
      expect(visibleText.length).toBeGreaterThan(50);
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: `tests/screenshots/${name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true 
      });
    });
  });
});

test.describe('Critical UI Elements', () => {
  test('Navigation menu should be visible and functional', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for navigation to be ready
    await page.waitForSelector('nav, [role="navigation"], header', { state: 'visible', timeout: 10000 });
    
    // Check for navigation
    const nav = page.locator('nav, [role="navigation"], header nav').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
    
    // Check for logo with more flexible selectors
    const logo = page.locator('img[alt*="Truth Hair"], img[alt*="logo"], a[href="/"] img, header a[href="/"]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    
    // Check for menu items
    const menuItems = page.locator('nav a, [role="navigation"] a, header a');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(3);
  });
  
  test('Footer should be present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Scroll to bottom to ensure footer is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for footer to be visible
    await page.waitForSelector('footer', { state: 'visible', timeout: 10000 });
    
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
    
    // Check footer has content
    const footerText = await footer.textContent();
    expect(footerText?.length).toBeGreaterThan(50);
  });
  
  test('Cart functionality should work', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for page to be fully loaded
    await page.waitForSelector('header, nav', { state: 'visible', timeout: 10000 });
    
    // Check cart icon exists with more flexible selectors
    const cartIcon = page.locator('[aria-label*="cart" i], [aria-label*="bag" i], a[href="/cart"], button:has-text("Cart"), svg[class*="cart" i], div[class*="cart" i] button, header button:has(svg)').first();
    await expect(cartIcon).toBeVisible({ timeout: 10000 });
  });
});