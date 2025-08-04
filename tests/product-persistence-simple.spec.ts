import { test, expect } from '@playwright/test';

test('Add product and verify persistence', async ({ page }) => {
  // Unique product name for this test
  const productName = `Test Product ${Date.now()}`;
  
  // Go to admin products page
  await page.goto('http://localhost:3003/admin/products');
  await page.waitForLoadState('networkidle');
  
  // Click Add Product button
  await page.click('button:has-text("Add Product")');
  
  // Wait for modal
  await page.waitForSelector('h2:has-text("Add New Product")');
  
  // Fill the form more carefully
  // Find all inputs in the modal and fill them by index
  const modal = page.locator('[role="dialog"], .modal, div:has(h2:has-text("Add New Product"))').first();
  
  // Fill Product Name (1st input)
  await modal.locator('input').first().fill(productName);
  
  // Fill Description (1st textarea)  
  await modal.locator('textarea').first().fill('Test product description for persistence testing');
  
  // Fill Price (use the ID)
  await modal.locator('#price').fill('199.99');
  
  // Fill Compare at Price (use the ID)
  await modal.locator('#compare_at_price').fill('299.99');
  
  // Fill SKU (find by position - 4th input after name, desc inputs, price, compare price)
  await modal.locator('input').nth(3).fill(`SKU${Date.now()}`);
  
  // Fill Stock (5th input)
  await modal.locator('input').nth(4).fill('25');
  
  // Now we need to find and click the submit button
  // First scroll to bottom of modal
  await modal.evaluate(node => {
    node.scrollTop = node.scrollHeight;
  });
  
  // Wait a bit for scroll
  await page.waitForTimeout(500);
  
  // Look for submit button at the bottom of the form
  const buttons = await modal.locator('button').all();
  
  // Find the last button (usually submit is at the bottom)
  for (let i = buttons.length - 1; i >= 0; i--) {
    const text = await buttons[i].textContent();
    if (text && (text.includes('Add') || text.includes('Create') || text.includes('Save'))) {
      await buttons[i].click();
      break;
    }
  }
  
  // Wait for modal to close and product to be added
  await page.waitForTimeout(2000);
  
  // Check if product appears in list
  const productExists = await page.locator(`text="${productName}"`).count() > 0;
  
  if (productExists) {
    console.log('✅ Product added successfully!');
  } else {
    console.log('❌ Product not found after adding');
  }
  
  // Now refresh the page
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  // Check if product still exists after refresh
  const productExistsAfterRefresh = await page.locator(`text="${productName}"`).count() > 0;
  
  if (productExistsAfterRefresh) {
    console.log('✅ Product persists after refresh!');
  } else {
    console.log('❌ Product lost after refresh');
  }
  
  // Assert that product persists
  expect(productExistsAfterRefresh).toBeTruthy();
});