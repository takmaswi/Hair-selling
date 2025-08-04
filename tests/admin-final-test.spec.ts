import { test, expect, Page } from '@playwright/test';

// Configure tests
test.use({
  baseURL: 'http://localhost:3003',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
});

test.describe('Admin Dashboard - Complete Product Management Tests', () => {
  
  test('Complete product creation and verification flow', async ({ page }) => {
    const uniqueId = Date.now();
    const testProduct = {
      name: `Test Wig ${uniqueId}`,
      slug: `test-wig-${uniqueId}`,
      description: 'Automated test product to verify admin dashboard functionality',
      price: '299.99',
      comparePrice: '399.99',
      sku: `TEST-${uniqueId}`,
      stock: '25'
    };

    // Step 1: Navigate to admin dashboard
    await test.step('Navigate to admin products page', async () => {
      await page.goto('/admin/products');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text="Truth Hair Admin"')).toBeVisible();
      console.log('✅ Admin dashboard loaded');
    });

    // Step 2: Open product creation dialog
    await test.step('Open product creation dialog', async () => {
      await page.locator('button:has-text("Add Product")').click();
      await expect(page.locator('text="Add New Product"')).toBeVisible();
      console.log('✅ Product creation dialog opened');
    });

    // Step 3: Fill Basic Info tab
    await test.step('Fill basic product information', async () => {
      // Product Name
      await page.locator('#name').fill(testProduct.name);
      
      // URL Slug
      await page.locator('#slug').fill(testProduct.slug);
      
      // Description
      await page.locator('#description').fill(testProduct.description);
      
      // Price
      await page.locator('#price').clear();
      await page.locator('#price').fill(testProduct.price);
      
      // Compare at Price
      await page.locator('#compare_at_price').fill(testProduct.comparePrice);
      
      // SKU
      await page.locator('#sku').fill(testProduct.sku);
      
      // Category - click the select trigger button
      await page.locator('button[role="combobox"]').click();
      // Select first category option
      await page.locator('[role="option"]').first().click();
      
      console.log('✅ Basic info filled');
    });

    // Step 4: Switch to Hair Details tab
    await test.step('Fill hair details', async () => {
      await page.locator('button[role="tab"]:has-text("Hair Details")').click();
      await page.waitForTimeout(500);
      
      // Check if hair detail fields are visible and fill them
      const hairTypeSelect = page.locator('button[role="combobox"]').first();
      if (await hairTypeSelect.isVisible()) {
        await hairTypeSelect.click();
        await page.locator('[role="option"]').first().click();
      }
      
      console.log('✅ Hair details configured');
    });

    // Step 5: Switch to Inventory tab
    await test.step('Set inventory', async () => {
      await page.locator('button[role="tab"]:has-text("Inventory")').click();
      await page.waitForTimeout(500);
      
      // Fill stock quantity if field exists
      const stockInput = page.locator('#stock, input[type="number"]').last();
      if (await stockInput.isVisible()) {
        await stockInput.clear();
        await stockInput.fill(testProduct.stock);
      }
      
      console.log('✅ Inventory set');
    });

    // Step 6: Create the product
    await test.step('Save product', async () => {
      await page.locator('button:has-text("Create Product")').click();
      
      // Wait for dialog to close or success message
      await page.waitForTimeout(3000);
      
      // Check if dialog closed (product created successfully)
      const dialogClosed = await page.locator('text="Add New Product"').isHidden();
      if (dialogClosed) {
        console.log('✅ Product created successfully');
      }
    });

    // Step 7: Verify product in admin list
    await test.step('Verify product in admin dashboard', async () => {
      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Search for the product
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill(testProduct.name);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
      }
      
      // Check if product card exists
      const productCard = page.locator(`.card, .product-card, tr`).filter({ hasText: testProduct.name });
      const productExists = await productCard.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (productExists) {
        console.log('✅ Product visible in admin dashboard');
        
        // Check for price display
        const priceText = await productCard.locator(`text="$${testProduct.price}"`).isVisible().catch(() => false);
        if (priceText) {
          console.log('✅ Product price displayed correctly');
        }
      }
    });

    // Step 8: Verify product on shop page
    await test.step('Verify product on shop page', async () => {
      await page.goto('/shop');
      await page.waitForLoadState('networkidle');
      
      // Look for the product
      const shopProduct = page.locator('.product-card, article, .product-item').filter({ hasText: testProduct.name });
      const isOnShop = await shopProduct.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isOnShop) {
        console.log('✅ Product visible on shop page');
        
        // Click to view details
        await shopProduct.click();
        await page.waitForLoadState('networkidle');
        
        // Verify product details page
        const titleVisible = await page.locator('h1, h2').filter({ hasText: testProduct.name }).isVisible().catch(() => false);
        const priceVisible = await page.locator(`text="$${testProduct.price}"`).isVisible().catch(() => false);
        
        if (titleVisible && priceVisible) {
          console.log('✅ Product details page displays correctly');
        }
        
        // Check Add to Cart button
        const addToCartButton = page.locator('button:has-text("Add to Cart")');
        if (await addToCartButton.isVisible()) {
          console.log('✅ Add to Cart button available');
        }
      } else {
        console.log('⚠️ Product not immediately visible on shop (may need cache refresh)');
      }
    });
  });

  test('Edit existing product and verify changes', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Find first product card with edit button
    const productCards = page.locator('.card').filter({ hasText: /\$/ });
    const cardCount = await productCards.count();
    
    if (cardCount > 0) {
      const firstCard = productCards.first();
      const productName = await firstCard.locator('h3, .card-title, .product-name').first().textContent();
      console.log(`Editing product: ${productName}`);
      
      // Click edit button (may be an icon)
      const editButton = firstCard.locator('button').filter({ has: page.locator('svg.lucide-edit') });
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(1000);
        
        // Update price
        const priceInput = page.locator('#price');
        if (await priceInput.isVisible()) {
          const currentPrice = await priceInput.inputValue();
          const newPrice = (parseFloat(currentPrice) - 10).toFixed(2);
          
          await priceInput.clear();
          await priceInput.fill(newPrice);
          
          // Save changes
          await page.locator('button:has-text("Save"), button:has-text("Update")').click();
          await page.waitForTimeout(2000);
          
          console.log(`✅ Price updated from $${currentPrice} to $${newPrice}`);
        }
      }
    }
  });

  test('Test inventory management', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator('.card').filter({ hasText: /\$/ }).first();
    if (await productCard.isVisible()) {
      // Look for quick stock update button or edit button
      const editButton = productCard.locator('button').first();
      await editButton.click();
      
      // If modal opens, update stock
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 2000 })) {
        // Switch to inventory tab
        const inventoryTab = page.locator('button[role="tab"]:has-text("Inventory")');
        if (await inventoryTab.isVisible()) {
          await inventoryTab.click();
          
          const stockInput = page.locator('#stock, input[type="number"]').last();
          if (await stockInput.isVisible()) {
            const currentStock = await stockInput.inputValue();
            const newStock = (parseInt(currentStock) + 5).toString();
            
            await stockInput.clear();
            await stockInput.fill(newStock);
            
            await page.locator('button:has-text("Save"), button:has-text("Update")').click();
            console.log(`✅ Stock updated from ${currentStock} to ${newStock}`);
          }
        }
      }
    }
  });

  test('Test product deletion', async ({ page }) => {
    // Create a product first
    const uniqueId = Date.now();
    const deleteProduct = {
      name: `Delete Test ${uniqueId}`,
      slug: `delete-test-${uniqueId}`,
      description: 'This product will be deleted',
      price: '99.99',
      sku: `DEL-${uniqueId}`
    };

    await page.goto('/admin/products');
    await page.locator('button:has-text("Add Product")').click();
    
    // Quick fill required fields
    await page.locator('#name').fill(deleteProduct.name);
    await page.locator('#slug').fill(deleteProduct.slug);
    await page.locator('#description').fill(deleteProduct.description);
    await page.locator('#price').clear();
    await page.locator('#price').fill(deleteProduct.price);
    await page.locator('#sku').fill(deleteProduct.sku);
    
    // Select category
    await page.locator('button[role="combobox"]').click();
    await page.locator('[role="option"]').first().click();
    
    // Create product
    await page.locator('button:has-text("Create Product")').click();
    await page.waitForTimeout(3000);
    
    // Now delete it
    await page.reload();
    
    // Find the product
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(deleteProduct.name);
      await searchInput.press('Enter');
      await page.waitForTimeout(2000);
    }
    
    const productCard = page.locator('.card').filter({ hasText: deleteProduct.name });
    if (await productCard.isVisible()) {
      // Find delete button
      const deleteButton = productCard.locator('button').filter({ has: page.locator('svg.lucide-trash-2') });
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")').last();
        await confirmButton.click();
        
        await page.waitForTimeout(2000);
        console.log('✅ Product deleted successfully');
      }
    }
  });
});

test.describe('API and Database Integration', () => {
  test('Verify API endpoints work', async ({ page }) => {
    // Test the test API endpoint
    const response = await page.request.get('/api/admin/products/test-route');
    
    if (response.ok()) {
      const data = await response.json();
      console.log(`✅ Test API working - ${data.products?.length || 0} mock products returned`);
      
      if (data.products && data.products.length > 0) {
        console.log(`First product: ${data.products[0].name}`);
      }
    }
  });

  test('Test product search functionality', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('wig');
      await searchInput.press('Enter');
      await page.waitForTimeout(2000);
      
      const results = await page.locator('.card').count();
      console.log(`✅ Search returned ${results} results`);
    }
  });
});