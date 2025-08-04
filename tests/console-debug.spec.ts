import { test, expect } from '@playwright/test';

test('Debug console logs', async ({ page }) => {
  // Capture all console messages
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    if (text.includes('Admin API Response') || text.includes('Setting products') || text.includes('Current products state')) {
      console.log('IMPORTANT LOG:', text);
    }
  });

  // Navigate to admin page
  await page.goto('http://localhost:3002/admin/products');
  
  // Wait for page to fully load
  await page.waitForTimeout(5000);
  
  // Print all console logs
  console.log('\n=== ALL CONSOLE LOGS ===');
  consoleLogs.forEach(log => console.log(log));
  
  // Check the actual products in the page
  const productsCount = await page.evaluate(() => {
    // Try to find React DevTools
    const reactDevTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (reactDevTools) {
      console.log('React DevTools found');
    }
    
    // Count visible product cards
    const cards = document.querySelectorAll('[class*="Card"]');
    const productCards = Array.from(cards).filter(card => {
      const text = card.textContent || '';
      return text.includes('$') && (text.includes('SKU') || text.includes('Stock'));
    });
    
    return productCards.length;
  });
  
  console.log('\nProduct cards found in DOM:', productsCount);
  
  // Check if "No products found" is visible
  const noProductsVisible = await page.locator('text="No products found"').isVisible().catch(() => false);
  console.log('No products message visible:', noProductsVisible);
});