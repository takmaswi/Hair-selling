import { test, expect } from '@playwright/test';

test('Verify Test Hair appears on website', async ({ page }) => {
  // Go to shop page
  await page.goto('http://localhost:3002/shop');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of shop page
  await page.screenshot({ path: 'shop-with-test-hair.png' });
  
  // Check if Test Hair is visible
  const testHairProduct = page.locator('text="Test Hair"');
  await expect(testHairProduct).toBeVisible({ timeout: 5000 });
  
  console.log('✅ Test Hair is visible on the shop page!');
  
  // Click on the product to see details
  await testHairProduct.first().click();
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of product details
  await page.screenshot({ path: 'test-hair-details.png' });
  
  // Verify product details
  await expect(page.locator('h1:has-text("Test Hair")')).toBeVisible();
  await expect(page.locator('text="$199.99"')).toBeVisible();
  await expect(page.locator('text="Premium test wig"')).toBeVisible();
  
  console.log('✅ Test Hair product details page works!');
  
  // Go to homepage and check featured products
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of homepage
  await page.screenshot({ path: 'homepage-with-test-hair.png' });
  
  console.log('✅ All tests passed! Test Hair is fully functional on the website.');
});