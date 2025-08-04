import { test, expect } from '@playwright/test';

test.describe('Admin Product Management', () => {
  test('should add a new product "Test Hair" and verify it appears on website', async ({ page }) => {
    // Go to admin dashboard
    await page.goto('http://localhost:3002/admin/products');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click on "Add Product" button
    const addButton = page.locator('button:has-text("Add Product"), a:has-text("Add Product")');
    if (await addButton.isVisible()) {
      await addButton.click();
    } else {
      // Try alternative navigation
      await page.goto('http://localhost:3002/admin/products/new');
    }
    
    // Fill in product details
    await page.fill('input[name="name"]', 'Test Hair');
    await page.fill('textarea[name="description"]', 'This is a test product added via Playwright automation');
    await page.fill('input[name="price"]', '199.99');
    await page.fill('input[name="sku"]', 'TEST-001');
    await page.fill('input[name="stock"]', '10');
    
    // Select category (if dropdown exists)
    const categorySelect = page.locator('select[name="category_id"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption('cat_human_hair');
    }
    
    // Select hair type
    const hairTypeSelect = page.locator('select[name="hair_type"]');
    if (await hairTypeSelect.isVisible()) {
      await hairTypeSelect.selectOption('HUMAN_HAIR');
    }
    
    // Set as active
    const activeCheckbox = page.locator('input[name="is_active"][type="checkbox"]');
    if (await activeCheckbox.isVisible()) {
      await activeCheckbox.check();
    }
    
    // Submit the form
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Create Product")');
    
    // Wait for navigation or success message
    await page.waitForLoadState('networkidle');
    
    // Now go to the main website to verify the product appears
    await page.goto('http://localhost:3002/shop');
    
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Check if "Test Hair" appears on the page
    const testProduct = page.locator('text=Test Hair');
    await expect(testProduct).toBeVisible({ timeout: 10000 });
    
    // Click on the product to verify details
    await testProduct.click();
    
    // Verify product details page
    await expect(page.locator('h1:has-text("Test Hair")')).toBeVisible();
    await expect(page.locator('text=$199.99')).toBeVisible();
    
    console.log('✅ Test Hair product successfully added and visible on website!');
  });
  
  test('should verify product appears in search', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3002');
    
    // Use search functionality if available
    const searchInput = page.locator('input[placeholder*="Search"], input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Hair');
      await searchInput.press('Enter');
      
      // Wait for search results
      await page.waitForLoadState('networkidle');
      
      // Verify Test Hair appears in results
      await expect(page.locator('text=Test Hair')).toBeVisible();
    }
  });
});