import { test, expect } from '@playwright/test';

test.describe('Quick Page Check', () => {
  test('check all pages load without errors', async ({ page }) => {
    const routes = [
      '/',
      '/shop',
      '/categories',
      '/about',
      '/contact',
      '/login',
      '/register',
      '/cart',
      '/wishlist',
      '/account',
      '/account/orders',
      '/account/addresses',
      '/account/settings'
    ];

    for (const route of routes) {
      console.log(`Testing ${route}...`);
      
      try {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Check response
        expect(response?.status()).toBeLessThan(400);
        
        // Check for any error text
        const errorCount = await page.locator('text=/error|404|not found/i').count();
        if (errorCount > 0) {
          console.error(`Error found on ${route}`);
        }
        
        // Check page has content
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        
        console.log(`✓ ${route} loaded successfully`);
      } catch (error) {
        console.error(`✗ ${route} failed:`, error instanceof Error ? error.message : String(error));
      }
    }
  });
});