import { test, expect } from '@playwright/test';

test.describe('Debug Admin Dashboard', () => {
  test('check admin dashboard elements', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', err => console.error('Page error:', err));
    
    // Navigate to admin products page
    await page.goto('http://localhost:3002/admin/products');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'admin-dashboard-debug.png', fullPage: true });
    
    // Check if the page title is correct
    const title = await page.locator('h1').first().textContent();
    console.log('Page title:', title);
    
    // Check for loading state
    const loadingElement = await page.locator('text=/Loading|loading/i').count();
    console.log('Loading elements found:', loadingElement);
    
    // Check for error messages
    const errorElements = await page.locator('text=/error|failed/i').count();
    console.log('Error elements found:', errorElements);
    
    // Check for "No products found" message
    const noProductsMessage = await page.locator('text=/No products found/i').count();
    console.log('No products message found:', noProductsMessage);
    
    // Check network requests
    const productRequests = [];
    page.on('response', response => {
      if (response.url().includes('/api/admin/products')) {
        productRequests.push({
          url: response.url(),
          status: response.status(),
          ok: response.ok()
        });
      }
    });
    
    // Reload the page to capture network requests
    await page.reload();
    await page.waitForTimeout(3000);
    
    console.log('Product API requests:', productRequests);
    
    // Check for any card elements
    const cards = await page.locator('[class*="card" i], [class*="Card"]').count();
    console.log('Card elements found:', cards);
    
    // Get all text content for debugging
    const bodyText = await page.locator('body').textContent();
    console.log('Body text preview:', bodyText?.substring(0, 500));
    
    // Check specific elements
    const productGrid = await page.locator('.grid, [class*="grid"]').count();
    console.log('Grid elements found:', productGrid);
    
    // Look for product-specific text
    const hasProductText = bodyText?.includes('SKU') || bodyText?.includes('Stock') || bodyText?.includes('Price');
    console.log('Has product-related text:', hasProductText);
  });
});