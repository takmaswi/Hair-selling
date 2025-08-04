import { test } from '@playwright/test';

test('Take screenshot after data loads', async ({ page }) => {
  // Navigate to admin page
  await page.goto('http://localhost:3002/admin/products');
  
  // Wait for API call to complete
  await page.waitForResponse(response => 
    response.url().includes('/api/admin/products') && response.status() === 200
  );
  
  // Wait a bit more for React to render
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'admin-dashboard-after-load.png', fullPage: true });
  
  // Also check what's actually in the DOM
  const pageContent = await page.evaluate(() => {
    const productsGrid = document.querySelector('.grid.grid-cols-1');
    if (productsGrid) {
      return {
        found: true,
        childCount: productsGrid.children.length,
        firstChildHTML: productsGrid.children[0]?.outerHTML?.substring(0, 200)
      };
    }
    return { found: false };
  });
  
  console.log('Products grid:', pageContent);
  
  // Check for specific product names
  const productNames = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3, [class*="CardTitle"]'));
    return titles.map(el => el.textContent).filter(text => text && text.length > 0);
  });
  
  console.log('Product titles found:', productNames);
});