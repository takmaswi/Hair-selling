import { test, expect, Page } from '@playwright/test';

const ADMIN_EMAIL = 'admin@truthhair.com';
const ADMIN_PASSWORD = 'Admin123!@#';

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin/dashboard');
}

async function createTestProduct(page: Page, productData: any) {
  await page.goto('/admin/products/new');
  
  await page.fill('input[name="name"]', productData.name);
  await page.fill('textarea[name="description"]', productData.description);
  await page.fill('input[name="price"]', productData.price.toString());
  await page.fill('input[name="quantity"]', productData.quantity.toString());
  await page.fill('input[name="sku"]', productData.sku);
  
  await page.selectOption('select[name="category"]', productData.category);
  await page.selectOption('select[name="hairLength"]', productData.hairLength);
  await page.selectOption('select[name="hairColor"]', productData.hairColor);
  
  if (productData.featured) {
    await page.check('input[name="featured"]');
  }
  
  await page.click('button:has-text("Create Product")');
  await page.waitForURL('/admin/products');
  
  const successMessage = page.locator('.toast-success, .success-message, [role="alert"]');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
}

test.describe('Admin Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Create new product and verify it appears on shop page', async ({ page }) => {
    const uniqueId = Date.now();
    const testProduct = {
      name: `Test Wig ${uniqueId}`,
      description: 'Premium quality test wig for automated testing',
      price: 299.99,
      quantity: 50,
      sku: `TEST-${uniqueId}`,
      category: 'human-hair',
      hairLength: 'medium',
      hairColor: 'black',
      featured: true
    };

    await createTestProduct(page, testProduct);

    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator(`.product-card:has-text("${testProduct.name}")`);
    await expect(productCard).toBeVisible({ timeout: 10000 });
    
    const priceElement = productCard.locator('.price, [data-testid="price"]');
    await expect(priceElement).toContainText(testProduct.price.toString());
    
    await productCard.click();
    await page.waitForURL(/\/products\/.+/);
    
    await expect(page.locator('h1')).toContainText(testProduct.name);
    await expect(page.locator('[data-testid="product-description"], .product-description')).toContainText(testProduct.description);
    await expect(page.locator('[data-testid="product-price"], .product-price')).toContainText(testProduct.price.toString());
    await expect(page.locator('[data-testid="stock-status"], .stock-status')).toContainText('In Stock');
  });

  test('Update product details and verify changes reflect on website', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    const firstProduct = page.locator('.product-row, tr').first();
    const productName = await firstProduct.locator('.product-name, td:first-child').textContent();
    
    await firstProduct.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    await page.waitForURL(/\/admin\/products\/.+\/edit/);
    
    const newPrice = '199.99';
    const newDescription = 'Updated description - Special offer!';
    
    await page.fill('input[name="price"]', newPrice);
    await page.fill('textarea[name="description"]', newDescription);
    
    await page.click('button:has-text("Save Changes"), button:has-text("Update")');
    
    const successMessage = page.locator('.toast-success, .success-message, [role="alert"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator(`.product-card:has-text("${productName}")`).first();
    await productCard.click();
    
    await expect(page.locator('[data-testid="product-price"], .product-price')).toContainText(newPrice);
    await expect(page.locator('[data-testid="product-description"], .product-description')).toContainText(newDescription);
  });

  test('Manage inventory - Update quantity and verify stock status', async ({ page }) => {
    const uniqueId = Date.now();
    const testProduct = {
      name: `Limited Stock Wig ${uniqueId}`,
      description: 'Test product for inventory management',
      price: 399.99,
      quantity: 5,
      sku: `LIMITED-${uniqueId}`,
      category: 'synthetic',
      hairLength: 'long',
      hairColor: 'blonde',
      featured: false
    };

    await createTestProduct(page, testProduct);

    await page.goto('/shop');
    const productCard = page.locator(`.product-card:has-text("${testProduct.name}")`);
    await productCard.click();
    
    const stockIndicator = page.locator('[data-testid="stock-quantity"], .stock-quantity, .inventory-count');
    await expect(stockIndicator).toContainText('5');
    
    await page.goto('/admin/products');
    const productRow = page.locator(`.product-row:has-text("${testProduct.name}"), tr:has-text("${testProduct.name}")`);
    await productRow.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    
    await page.fill('input[name="quantity"]', '0');
    await page.click('button:has-text("Save Changes"), button:has-text("Update")');
    
    await page.goto('/shop');
    await productCard.click();
    
    const outOfStockIndicator = page.locator('[data-testid="stock-status"], .stock-status, .out-of-stock');
    await expect(outOfStockIndicator).toContainText(/Out of Stock|Sold Out|Unavailable/i);
    
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeDisabled();
  });

  test('Simulate purchase and verify inventory update', async ({ page }) => {
    const uniqueId = Date.now();
    const initialQuantity = 10;
    const testProduct = {
      name: `Purchase Test Wig ${uniqueId}`,
      description: 'Test product for purchase simulation',
      price: 249.99,
      quantity: initialQuantity,
      sku: `PURCHASE-${uniqueId}`,
      category: 'human-hair',
      hairLength: 'short',
      hairColor: 'brown',
      featured: false
    };

    await createTestProduct(page, testProduct);

    await page.goto('/shop');
    const productCard = page.locator(`.product-card:has-text("${testProduct.name}")`);
    await productCard.click();
    
    await page.click('button:has-text("Add to Cart")');
    
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    const quantityInput = page.locator('input[name="quantity"], input[type="number"]').first();
    await quantityInput.fill('3');
    
    await page.click('button:has-text("Checkout"), a:has-text("Checkout")');
    
    await page.fill('input[name="email"]', 'test@customer.com');
    await page.fill('input[name="name"]', 'Test Customer');
    await page.fill('input[name="address"]', '123 Test Street');
    await page.fill('input[name="city"]', 'Test City');
    await page.fill('input[name="postalCode"]', '12345');
    await page.fill('input[name="phone"]', '+1234567890');
    
    await page.click('button:has-text("Place Order"), button:has-text("Complete Purchase")');
    
    await page.waitForURL(/\/(success|order-confirmation|thank-you)/);
    
    await loginAsAdmin(page);
    await page.goto('/admin/products');
    
    const updatedProductRow = page.locator(`.product-row:has-text("${testProduct.name}"), tr:has-text("${testProduct.name}")`);
    const quantityCell = updatedProductRow.locator('.quantity-cell, td:nth-child(4), [data-testid="quantity"]');
    
    await expect(quantityCell).toContainText('7');
  });

  test('Manually update inventory for offline purchase', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    const firstProduct = page.locator('.product-row, tr').first();
    const originalQuantity = await firstProduct.locator('.quantity-cell, td:nth-child(4), [data-testid="quantity"]').textContent();
    const originalQty = parseInt(originalQuantity || '0');
    
    await firstProduct.locator('button:has-text("Quick Edit"), button:has-text("Edit Stock")').click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    const newQuantity = originalQty - 2;
    await modal.locator('input[name="quantity"], input[type="number"]').fill(newQuantity.toString());
    
    await modal.locator('input[name="reason"], textarea[name="reason"]').fill('Offline sale - 2 units sold in store');
    
    await modal.locator('button:has-text("Update"), button:has-text("Save")').click();
    
    await expect(modal).not.toBeVisible();
    
    const updatedQuantity = await firstProduct.locator('.quantity-cell, td:nth-child(4), [data-testid="quantity"]').textContent();
    expect(parseInt(updatedQuantity || '0')).toBe(newQuantity);
    
    const productName = await firstProduct.locator('.product-name, td:first-child').textContent();
    await page.goto('/shop');
    const productCard = page.locator(`.product-card:has-text("${productName}")`).first();
    await productCard.click();
    
    const stockDisplay = page.locator('[data-testid="stock-quantity"], .stock-quantity, .inventory-count');
    await expect(stockDisplay).toContainText(newQuantity.toString());
  });

  test('Bulk update products and verify changes', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    await page.check('input[type="checkbox"]#select-all, input[type="checkbox"].select-all');
    
    await page.click('button:has-text("Bulk Actions"), button:has-text("Actions")');
    await page.click('button:has-text("Update Prices"), [data-action="bulk-price"]');
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    await modal.locator('input[name="percentage"], input[name="discount"]').fill('10');
    await modal.locator('button:has-text("Apply Discount")').click();
    
    const successMessage = page.locator('.toast-success, .success-message, [role="alert"]');
    await expect(successMessage).toContainText(/updated|applied/i);
    
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    const saleBadges = page.locator('.sale-badge, .discount-badge, [data-testid="sale"]');
    const count = await saleBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Delete product and verify removal from shop', async ({ page }) => {
    const uniqueId = Date.now();
    const testProduct = {
      name: `Delete Test Wig ${uniqueId}`,
      description: 'This product will be deleted',
      price: 199.99,
      quantity: 5,
      sku: `DELETE-${uniqueId}`,
      category: 'synthetic',
      hairLength: 'medium',
      hairColor: 'red',
      featured: false
    };

    await createTestProduct(page, testProduct);

    await page.goto('/shop');
    let productExists = await page.locator(`.product-card:has-text("${testProduct.name}")`).isVisible();
    expect(productExists).toBe(true);
    
    await page.goto('/admin/products');
    const productRow = page.locator(`.product-row:has-text("${testProduct.name}"), tr:has-text("${testProduct.name}")`);
    
    await productRow.locator('button:has-text("Delete"), button[aria-label="Delete"]').click();
    
    const confirmDialog = page.locator('.confirm-dialog, [role="alertdialog"]');
    await confirmDialog.locator('button:has-text("Confirm"), button:has-text("Yes")').click();
    
    await expect(productRow).not.toBeVisible();
    
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    productExists = await page.locator(`.product-card:has-text("${testProduct.name}")`).isVisible();
    expect(productExists).toBe(false);
  });

  test('Product status toggle (active/inactive)', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    const firstProduct = page.locator('.product-row, tr').first();
    const productName = await firstProduct.locator('.product-name, td:first-child').textContent();
    
    const statusToggle = firstProduct.locator('input[type="checkbox"][name*="active"], .status-toggle');
    const isActive = await statusToggle.isChecked();
    
    await statusToggle.click();
    await page.waitForTimeout(1000);
    
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator(`.product-card:has-text("${productName}")`);
    
    if (isActive) {
      await expect(productCard).not.toBeVisible();
    } else {
      await expect(productCard).toBeVisible();
    }
    
    await page.goto('/admin/products');
    await statusToggle.click();
    await page.waitForTimeout(1000);
    
    await page.goto('/shop');
    const productCardAfter = page.locator(`.product-card:has-text("${productName}")`);
    
    if (isActive) {
      await expect(productCardAfter).toBeVisible();
    } else {
      await expect(productCardAfter).not.toBeVisible();
    }
  });
});

test.describe('Database Integrity Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Verify database sync after manual quantity update', async ({ page }) => {
    await page.goto('/admin/products');
    const firstProduct = page.locator('.product-row, tr').first();
    const productId = await firstProduct.getAttribute('data-product-id');
    
    await firstProduct.locator('button:has-text("Edit"), a:has-text("Edit")').click();
    
    const currentQuantity = await page.locator('input[name="quantity"]').inputValue();
    const newQuantity = parseInt(currentQuantity) + 10;
    
    await page.fill('input[name="quantity"]', newQuantity.toString());
    await page.click('button:has-text("Save Changes"), button:has-text("Update")');
    
    await page.goto(`/api/products/${productId}`);
    const apiResponse = await page.textContent('body');
    const productData = JSON.parse(apiResponse);
    
    expect(productData.quantity).toBe(newQuantity);
  });

  test('Verify order history reflects inventory changes', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    
    const ordersExist = await page.locator('.order-row, tr.order').count();
    
    if (ordersExist > 0) {
      const firstOrder = page.locator('.order-row, tr.order').first();
      await firstOrder.click();
      
      const orderDetails = page.locator('.order-details, .order-modal');
      await expect(orderDetails).toBeVisible();
      
      const inventoryLog = orderDetails.locator('.inventory-changes, .stock-log');
      const logEntries = await inventoryLog.locator('.log-entry, li').count();
      
      expect(logEntries).toBeGreaterThan(0);
    }
  });

  test('Product search and filter functionality', async ({ page }) => {
    await page.goto('/admin/products');
    
    await page.fill('input[placeholder*="Search"], input[name="search"]', 'wig');
    await page.keyboard.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    const searchResults = await page.locator('.product-row, tr.product').count();
    expect(searchResults).toBeGreaterThan(0);
    
    await page.selectOption('select[name="category"], select#category-filter', 'human-hair');
    await page.waitForLoadState('networkidle');
    
    const filteredResults = page.locator('.product-row, tr.product');
    for (let i = 0; i < await filteredResults.count(); i++) {
      const category = await filteredResults.nth(i).locator('.category-cell, td.category').textContent();
      expect(category?.toLowerCase()).toContain('human');
    }
  });
});