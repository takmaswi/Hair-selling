import { test, expect } from '@playwright/test';

test('Check API response and page behavior', async ({ page }) => {
  // Intercept API calls
  await page.route('**/api/admin/products*', async route => {
    const response = await route.fetch();
    const json = await response.json();
    console.log('API Response:', JSON.stringify(json, null, 2));
    console.log('Number of products in response:', json.data?.length || 0);
    await route.fulfill({ response, json });
  });

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser error:', msg.text());
    }
  });

  // Navigate to admin page
  await page.goto('http://localhost:3002/admin/products');
  
  // Wait for API call
  await page.waitForTimeout(3000);
  
  // Check the products state in the component
  const productsCount = await page.evaluate(() => {
    // Try to access React component state
    const reactFiber = (document.querySelector('[class*="grid"]') as any)?._reactInternalFiber || 
                       (document.querySelector('[class*="grid"]') as any)?._reactInternalInstance;
    console.log('React Fiber:', reactFiber);
    
    // Check for any data attributes
    const elements = document.querySelectorAll('[data-product-id], [class*="product"]');
    console.log('Product elements found:', elements.length);
    
    return elements.length;
  });
  
  console.log('Products elements in DOM:', productsCount);
  
  // Check the loading state
  const loadingVisible = await page.locator('[class*="Loader"], [class*="loading"], [class*="spinner"]').isVisible().catch(() => false);
  console.log('Loading state visible:', loadingVisible);
  
  // Check error state
  const errorVisible = await page.locator('text=/error|failed/i').isVisible().catch(() => false);
  console.log('Error state visible:', errorVisible);
  
  // Check empty state
  const emptyStateVisible = await page.locator('text=/No products found/i').isVisible().catch(() => true);
  console.log('Empty state visible:', emptyStateVisible);
  
  // Get the actual HTML content of the products area
  const productsAreaHTML = await page.locator('[class*="grid"]').last().innerHTML().catch(() => 'Not found');
  console.log('Products area HTML (first 500 chars):', productsAreaHTML.substring(0, 500));
});