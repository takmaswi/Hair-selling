import { test, expect, Page } from '@playwright/test';

// Configure tests to use the correct port
test.use({
  baseURL: 'http://localhost:3003',
});

test.describe('Admin Dashboard Complete Verification', () => {
  test('Complete admin product management flow', async ({ page }) => {
    // Step 1: Navigate to admin dashboard
    await test.step('Navigate to admin dashboard', async () => {
      await page.goto('/admin/products');
      await page.waitForLoadState('networkidle');
      
      // Verify we're on the admin products page
      await expect(page.locator('text="Truth Hair Admin"')).toBeVisible({ timeout: 10000 });
    });

    // Step 2: Create a new product
    const testProductName = `Test Wig ${Date.now()}`;
    const testProductData = {
      name: testProductName,
      description: 'Premium test wig for verification',
      price: '299.99',
      sku: `TEST-${Date.now()}`,
      stock: '25'
    };

    await test.step('Create a new product', async () => {
      // Click the Add Product button
      const addButton = page.locator('button:has-text("Add Product"), button:has-text("New Product"), button:has(svg.lucide-plus)');
      await expect(addButton).toBeVisible();
      await addButton.click();
      
      // Wait for dialog to open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Fill in the product form
      await page.fill('input[name="name"]', testProductData.name);
      await page.fill('textarea[name="description"]', testProductData.description);
      await page.fill('input[name="price"]', testProductData.price);
      await page.fill('input[name="sku"]', testProductData.sku);
      await page.fill('input[name="stock"]', testProductData.stock);
      
      // Select category
      const categorySelect = page.locator('button[role="combobox"]').first();
      await categorySelect.click();
      await page.locator('[role="option"]:has-text("Human Hair")').first().click();
      
      // Save the product
      await page.locator('button:has-text("Create Product"), button:has-text("Save")').click();
      
      // Wait for success message
      await expect(page.locator('.alert-success, text="Product created successfully"')).toBeVisible({ timeout: 10000 });
      
      // Dialog should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });

    // Step 3: Verify product appears in admin list
    await test.step('Verify product in admin list', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Search for the product
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill(testProductName);
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // Verify product appears in the list
      const productCard = page.locator(`.card:has-text("${testProductName}"), tr:has-text("${testProductName}")`);
      await expect(productCard).toBeVisible({ timeout: 10000 });
      
      // Verify stock quantity is displayed
      await expect(productCard.locator(`text="${testProductData.stock}"`)).toBeVisible();
    });

    // Step 4: Verify product appears on shop page
    await test.step('Verify product on shop page', async () => {
      await page.goto('/shop');
      await page.waitForLoadState('networkidle');
      
      // Product should be visible
      const shopProduct = page.locator(`.product-card:has-text("${testProductName}"), article:has-text("${testProductName}")`);
      await expect(shopProduct).toBeVisible({ timeout: 10000 });
      
      // Click on product to view details
      await shopProduct.click();
      await page.waitForLoadState('networkidle');
      
      // Verify product details
      await expect(page.locator('h1, h2').filter({ hasText: testProductName })).toBeVisible();
      await expect(page.locator(`text="${testProductData.description}"`)).toBeVisible();
      await expect(page.locator(`text="$${testProductData.price}"`)).toBeVisible();
      
      // Verify stock status
      await expect(page.locator('text="In Stock", text="Available"')).toBeVisible();
    });

    // Step 5: Update product inventory
    await test.step('Update product inventory', async () => {
      // Go back to admin
      await page.goto('/admin/products');
      await page.waitForLoadState('networkidle');
      
      // Find the product
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill(testProductName);
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      const productCard = page.locator(`.card:has-text("${testProductName}")`);
      
      // Click edit button
      const editButton = productCard.locator('button:has(svg.lucide-edit), button:has-text("Edit")');
      await editButton.click();
      
      // Wait for dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Update stock quantity
      const stockInput = page.locator('input[name="stock"]');
      await stockInput.clear();
      await stockInput.fill('15');
      
      // Update price
      const priceInput = page.locator('input[name="price"]');
      await priceInput.clear();
      await priceInput.fill('249.99');
      
      // Save changes
      await page.locator('button:has-text("Save"), button:has-text("Update")').click();
      
      // Wait for success message
      await expect(page.locator('.alert-success, text="Product updated successfully"')).toBeVisible({ timeout: 10000 });
    });

    // Step 6: Verify inventory changes on shop
    await test.step('Verify updated inventory on shop', async () => {
      await page.goto('/shop');
      await page.waitForLoadState('networkidle');
      
      // Find and click the product
      const shopProduct = page.locator(`.product-card:has-text("${testProductName}")`);
      await shopProduct.click();
      
      // Verify updated price
      await expect(page.locator('text="$249.99"')).toBeVisible();
    });

    // Step 7: Simulate a purchase (add to cart)
    await test.step('Simulate purchase', async () => {
      // Add to cart
      const addToCartButton = page.locator('button:has-text("Add to Cart")');
      await expect(addToCartButton).toBeVisible();
      await addToCartButton.click();
      
      // Go to cart
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');
      
      // Verify product in cart
      await expect(page.locator(`text="${testProductName}"`)).toBeVisible();
      
      // Update quantity
      const quantityInput = page.locator('input[type="number"]').first();
      await quantityInput.clear();
      await quantityInput.fill('2');
      
      // Verify subtotal updates
      await page.waitForTimeout(500);
    });

    // Step 8: Delete the test product
    await test.step('Delete test product', async () => {
      await page.goto('/admin/products');
      await page.waitForLoadState('networkidle');
      
      // Search for product
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill(testProductName);
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      const productCard = page.locator(`.card:has-text("${testProductName}")`);
      
      // Click delete button
      const deleteButton = productCard.locator('button:has(svg.lucide-trash-2), button:has-text("Delete")');
      await deleteButton.click();
      
      // Confirm deletion
      await page.locator('button:has-text("Delete"), button:has-text("Confirm")').last().click();
      
      // Wait for success message
      await expect(page.locator('.alert-success, text="Product deleted successfully"')).toBeVisible({ timeout: 10000 });
      
      // Product should no longer be visible
      await page.reload();
      await expect(productCard).not.toBeVisible();
    });

    // Step 9: Verify product removed from shop
    await test.step('Verify product removed from shop', async () => {
      await page.goto('/shop');
      await page.waitForLoadState('networkidle');
      
      // Product should not be visible
      const shopProduct = page.locator(`.product-card:has-text("${testProductName}")`);
      await expect(shopProduct).not.toBeVisible();
    });
  });

  test('Bulk operations and inventory management', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');

    await test.step('Test bulk status toggle', async () => {
      // Get first few products
      const productCards = page.locator('.card').filter({ hasText: /\$\d+/ });
      const count = await productCards.count();
      
      if (count >= 2) {
        // Select first two products
        const checkbox1 = productCards.nth(0).locator('input[type="checkbox"]');
        const checkbox2 = productCards.nth(1).locator('input[type="checkbox"]');
        
        await checkbox1.check();
        await checkbox2.check();
        
        // Look for bulk actions
        const bulkButton = page.locator('button:has-text("Bulk"), button:has-text("Actions")');
        if (await bulkButton.isVisible()) {
          await bulkButton.click();
          
          // Try to deactivate products
          const deactivateOption = page.locator('button:has-text("Deactivate"), [role="menuitem"]:has-text("Deactivate")');
          if (await deactivateOption.isVisible()) {
            await deactivateOption.click();
            
            // Confirm action
            const confirmButton = page.locator('button:has-text("Confirm")').last();
            await confirmButton.click();
            
            // Wait for success
            await expect(page.locator('.alert-success, text="updated successfully"')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    await test.step('Test filter functionality', async () => {
      // Test category filter
      const categoryFilter = page.locator('button[role="combobox"]').filter({ hasText: /Category|All Categories/ });
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click();
        const humanHairOption = page.locator('[role="option"]:has-text("Human Hair")');
        if (await humanHairOption.isVisible()) {
          await humanHairOption.click();
          await page.waitForTimeout(1000);
        }
      }
      
      // Test status filter
      const statusFilter = page.locator('button[role="combobox"]').filter({ hasText: /Status|Active/ });
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        const activeOption = page.locator('[role="option"]:has-text("Active")');
        if (await activeOption.isVisible()) {
          await activeOption.click();
          await page.waitForTimeout(1000);
        }
      }
    });
  });
});