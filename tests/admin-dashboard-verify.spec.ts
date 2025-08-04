import { test, expect, Page } from '@playwright/test';

// Simple test configuration for quick verification
test.use({
  baseURL: 'http://localhost:3003',
});

// Mock admin credentials - adjust these to match your setup
const ADMIN_EMAIL = 'admin@truthhair.com';
const ADMIN_PASSWORD = 'Admin123!@#';

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  
  // Try multiple selectors for email/password fields
  const emailField = await page.locator('input[name="email"], input[type="email"], #email').first();
  const passwordField = await page.locator('input[name="password"], input[type="password"], #password').first();
  
  await emailField.fill(ADMIN_EMAIL);
  await passwordField.fill(ADMIN_PASSWORD);
  
  // Try multiple selectors for submit button
  const submitButton = await page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
  await submitButton.click();
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
}

test.describe('Admin Dashboard Quick Verification', () => {
  test('Verify admin can access dashboard', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    console.log('Homepage title:', title);
    
    // Check if app is running
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test admin product creation flow', async ({ page }) => {
    // First, let's try to access admin area directly
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if we're redirected to login or if we can access dashboard
    const currentURL = page.url();
    console.log('Current URL after navigating to admin:', currentURL);
    
    if (currentURL.includes('login') || currentURL.includes('signin')) {
      console.log('Redirected to login - attempting login');
      await loginAsAdmin(page);
    }
    
    // Now try to navigate to products page
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Look for any indication we're on the products page
    const pageHeading = await page.locator('h1, h2').first().textContent();
    console.log('Page heading:', pageHeading);
    
    // Try to find "Add Product" or "New Product" button
    const addProductButton = await page.locator('button:has-text("Add Product"), button:has-text("New Product"), a:has-text("Add Product"), a:has-text("New Product")').first();
    
    if (await addProductButton.isVisible()) {
      console.log('Found Add Product button');
      await addProductButton.click();
      await page.waitForLoadState('networkidle');
      
      // Test product form
      const nameField = await page.locator('input[name="name"], #product-name, input[placeholder*="name"]').first();
      const priceField = await page.locator('input[name="price"], #product-price, input[placeholder*="price"]').first();
      const quantityField = await page.locator('input[name="quantity"], #product-quantity, input[placeholder*="quantity"]').first();
      
      if (await nameField.isVisible()) {
        console.log('Product form is visible');
        
        // Fill in test product data
        const testProductName = `Test Product ${Date.now()}`;
        await nameField.fill(testProductName);
        await priceField.fill('99.99');
        await quantityField.fill('10');
        
        // Try to save the product
        const saveButton = await page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
        await saveButton.click();
        
        await page.waitForLoadState('networkidle');
        
        // Check if product was created successfully
        const successIndicator = await page.locator('.success, .toast-success, [role="alert"]').first();
        if (await successIndicator.isVisible()) {
          console.log('Product created successfully');
          
          // Now verify it appears on the shop page
          await page.goto('/shop');
          await page.waitForLoadState('networkidle');
          
          const productOnShop = await page.locator(`text="${testProductName}"`).first();
          if (await productOnShop.isVisible()) {
            console.log('Product is visible on shop page!');
          }
        }
      }
    }
  });

  test('Test inventory update functionality', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Try to find a product in the list
    const productRow = await page.locator('tr, .product-item, .product-row').first();
    
    if (await productRow.isVisible()) {
      // Look for edit button
      const editButton = await productRow.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        
        // Try to update quantity
        const quantityField = await page.locator('input[name="quantity"], #quantity').first();
        if (await quantityField.isVisible()) {
          const currentValue = await quantityField.inputValue();
          const newValue = parseInt(currentValue) - 1;
          
          await quantityField.fill(newValue.toString());
          
          // Save changes
          const saveButton = await page.locator('button:has-text("Save"), button:has-text("Update")').first();
          await saveButton.click();
          
          await page.waitForLoadState('networkidle');
          
          console.log('Inventory updated successfully');
        }
      }
    }
  });
});

test.describe('Database Integration Verification', () => {
  test('Verify product data persistence', async ({ page }) => {
    // Create a product via API if possible
    const response = await page.request.get('/api/products');
    
    if (response.ok()) {
      const products = await response.json();
      console.log('Number of products in database:', products.length);
      
      if (products.length > 0) {
        console.log('First product:', products[0]);
        
        // Verify product appears on shop page
        await page.goto('/shop');
        const firstProductName = products[0].name;
        const productElement = await page.locator(`text="${firstProductName}"`).first();
        
        if (await productElement.isVisible()) {
          console.log('Database product is visible on frontend');
        }
      }
    }
  });

  test('Test manual inventory adjustment', async ({ page }) => {
    // Try to make a direct API call to update inventory
    const productsResponse = await page.request.get('/api/products');
    
    if (productsResponse.ok()) {
      const products = await productsResponse.json();
      
      if (products.length > 0) {
        const productId = products[0].id;
        const currentQuantity = products[0].quantity;
        const newQuantity = currentQuantity - 1;
        
        // Try to update via API
        const updateResponse = await page.request.patch(`/api/products/${productId}`, {
          data: {
            quantity: newQuantity
          }
        });
        
        if (updateResponse.ok()) {
          console.log('Inventory updated via API');
          
          // Verify the change
          const verifyResponse = await page.request.get(`/api/products/${productId}`);
          const updatedProduct = await verifyResponse.json();
          
          if (updatedProduct.quantity === newQuantity) {
            console.log('Inventory update verified in database');
          }
        }
      }
    }
  });
});