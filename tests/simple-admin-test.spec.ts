import { test, expect } from '@playwright/test';

test.describe('Admin Product Test', () => {
  test('Add Test Hair product via admin', async ({ page }) => {
    // Navigate to admin products page
    await page.goto('http://localhost:3002/admin/products', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    // Take screenshot of admin dashboard
    await page.screenshot({ path: 'admin-products-page.png' });

    // Check if we need to add a new product or if there's an add button
    const addNewButton = page.locator('a[href="/admin/products/new"], button:has-text("Add Product"), button:has-text("New Product")').first();
    
    if (await addNewButton.count() > 0) {
      await addNewButton.click();
      await page.waitForLoadState('domcontentloaded');
    } else {
      // Navigate directly to new product page
      await page.goto('http://localhost:3002/admin/products/new', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
    }

    // Take screenshot of new product form
    await page.screenshot({ path: 'new-product-form.png' });

    // Fill in the product form
    await page.fill('input[name="name"], input[placeholder*="name" i], #name', 'Test Hair');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i], #description', 'Test product added via automation');
    await page.fill('input[name="price"], input[placeholder*="price" i], #price', '199.99');
    await page.fill('input[name="sku"], input[placeholder*="sku" i], #sku', 'TEST-001');
    
    // Try to fill stock
    const stockInput = page.locator('input[name="stock"], input[placeholder*="stock" i], #stock');
    if (await stockInput.count() > 0) {
      await stockInput.fill('10');
    }

    // Select category if available
    const categorySelect = page.locator('select[name="category_id"], select[name="category"], #category_id');
    if (await categorySelect.count() > 0) {
      await categorySelect.selectOption({ index: 1 }); // Select first category
    }

    // Check active checkbox if present
    const activeCheckbox = page.locator('input[type="checkbox"][name="is_active"], input[type="checkbox"]#is_active');
    if (await activeCheckbox.count() > 0) {
      await activeCheckbox.check();
    }

    // Take screenshot before submitting
    await page.screenshot({ path: 'before-submit.png' });

    // Submit the form
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create"), button:has-text("Add Product")').first();
    await submitButton.click();

    // Wait for navigation or success message
    await page.waitForTimeout(2000);

    // Take screenshot after submit
    await page.screenshot({ path: 'after-submit.png' });

    console.log('✅ Product form submitted');

    // Now check if product appears on main site
    await page.goto('http://localhost:3002/shop', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    // Take screenshot of shop page
    await page.screenshot({ path: 'shop-page.png' });

    // Check if Test Hair is visible
    const testHairProduct = page.locator('text="Test Hair"');
    const isVisible = await testHairProduct.isVisible().catch(() => false);

    if (isVisible) {
      console.log('✅ Test Hair product is visible on the shop page!');
    } else {
      console.log('❌ Test Hair product not found on shop page');
      
      // Try searching for it
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('Test Hair');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        const searchResult = await page.locator('text="Test Hair"').isVisible().catch(() => false);
        if (searchResult) {
          console.log('✅ Test Hair found via search!');
        }
      }
    }

    // Final screenshot
    await page.screenshot({ path: 'final-result.png' });
  });
});