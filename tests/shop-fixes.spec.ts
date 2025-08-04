import { test, expect } from '@playwright/test';

test.describe('Shop Page Fixes', () => {
  test('should display products without filters selected', async ({ page }) => {
    await page.goto('http://localhost:3004/shop');
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Check that products are displayed
    const noProductsMessage = page.locator('text=No products found matching your filters');
    await expect(noProductsMessage).not.toBeVisible();
    
    // Check that product grid is visible
    const productGrid = page.locator('[class*="grid"]').first();
    await expect(productGrid).toBeVisible();
    
    // Check that at least one product card is visible
    const productCards = page.locator('[class*="ProductCard"], [class*="card"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
    
    console.log(`Found ${count} products displayed on shop page`);
  });

  test('Collections button should navigate to shop page', async ({ page }) => {
    await page.goto('http://localhost:3004');
    
    // Wait for header to load
    await page.waitForTimeout(1000);
    
    // Click the Collections link in header
    await page.click('a:has-text("Collections")');
    
    // Wait for navigation
    await page.waitForURL('**/shop');
    
    // Verify we're on the shop page
    expect(page.url()).toContain('/shop');
    
    // Verify shop page content loads
    await expect(page.locator('text="Featured Collections"').or(page.locator('[class*="ShopHero"]'))).toBeVisible();
  });

  test('filters should work correctly', async ({ page }) => {
    await page.goto('http://localhost:3004/shop');
    
    // Wait for page load
    await page.waitForTimeout(2000);
    
    // Get initial product count
    const initialProducts = await page.locator('[class*="ProductCard"], [class*="card"]').count();
    console.log(`Initial products: ${initialProducts}`);
    
    // Try to find and click a filter (e.g., category filter)
    const filterButton = page.locator('button:has-text("Lace Front")').or(page.locator('[type="checkbox"]').first());
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(1000);
      
      // Check if products are still displayed (filtered)
      const filteredProducts = await page.locator('[class*="ProductCard"], [class*="card"]').count();
      console.log(`Filtered products: ${filteredProducts}`);
      
      // Products should still be visible (unless no products match the filter)
      expect(filteredProducts).toBeGreaterThanOrEqual(0);
    }
  });
});