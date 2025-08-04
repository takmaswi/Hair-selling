import { test, expect } from '@playwright/test';

test('Product persists after page refresh', async ({ page }) => {
  // Test data for new product
  const testProduct = {
    name: `Test Hair Product ${Date.now()}`,
    price: '299.99',
    description: 'This is a test product to verify persistence',
    category: 'human-hair',
    stock: '15'
  };

  // Navigate to admin products page
  await page.goto('http://localhost:3003/admin/products');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Click Add Product button
  await page.click('button:has-text("Add Product")');
  
  // Wait for modal to appear
  await page.waitForSelector('text="Add New Product"');
  
  // Fill in product form - using parent/child relationships
  // Product Name field (first input in the modal)
  const modalContent = page.locator('div:has(h2:has-text("Add New Product"))');
  await modalContent.locator('input').first().fill(testProduct.name);
  
  // Description (first textarea)
  await modalContent.locator('textarea').first().fill(testProduct.description);
  
  // Price (third input)
  await modalContent.locator('input').nth(2).fill(testProduct.price);
  
  // SKU (fourth input) - generate a unique SKU
  const sku = `SKU-${Date.now()}`;
  await modalContent.locator('input').nth(3).fill(sku);
  
  // Stock (fifth input) 
  await modalContent.locator('input').nth(4).fill(testProduct.stock);
  
  // Scroll down in the modal to see the submit button
  await page.evaluate(() => {
    const modal = document.querySelector('div[role="dialog"]') || document.querySelector('.modal-content');
    if (modal) modal.scrollTop = modal.scrollHeight;
  });
  
  // Submit the form - look for any button with submit-like text
  const submitButton = modalContent.locator('button').filter({ hasText: /add product|create|submit|save/i }).first();
  await submitButton.click();
  
  // Wait for navigation or success message
  await page.waitForLoadState('networkidle');
  
  // Verify product appears in the list
  await expect(page.locator(`text="${testProduct.name}"`)).toBeVisible();
  
  console.log('✅ Product added successfully');
  
  // Now refresh the page
  await page.reload();
  
  // Wait for page to load after refresh
  await page.waitForLoadState('networkidle');
  
  // Check if the product is still there after refresh
  await expect(page.locator(`text="${testProduct.name}"`)).toBeVisible();
  
  console.log('✅ Product persists after page refresh!');
  
  // Additional verification - check product details are correct
  const productRow = page.locator(`tr:has-text("${testProduct.name}")`);
  await expect(productRow).toContainText(testProduct.price);
  await expect(productRow).toContainText(testProduct.stock);
  
  console.log('✅ Product details verified successfully');
});