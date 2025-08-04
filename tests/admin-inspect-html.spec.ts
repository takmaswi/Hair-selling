import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'http://localhost:3003',
});

test('Capture admin form HTML for selector analysis', async ({ page }) => {
  // Navigate to admin products page
  await page.goto('/admin/products');
  await page.waitForLoadState('networkidle');
  
  // Click Add Product button
  const addButton = page.locator('button:has-text("Add Product")');
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  // Wait for dialog to open
  await page.waitForTimeout(2000);
  
  // Get the HTML of the dialog
  const dialogHTML = await page.locator('[role="dialog"], .dialog, .modal').innerHTML();
  
  // Log the HTML structure
  console.log('=== DIALOG HTML STRUCTURE ===');
  console.log(dialogHTML);
  
  // Try to find all input fields
  const inputs = await page.locator('[role="dialog"] input').all();
  console.log(`\n=== Found ${inputs.length} input fields ===`);
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const id = await input.getAttribute('id');
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    const type = await input.getAttribute('type');
    
    console.log(`Input ${i + 1}:`);
    console.log(`  ID: ${id}`);
    console.log(`  Name: ${name}`);
    console.log(`  Type: ${type}`);
    console.log(`  Placeholder: ${placeholder}`);
  }
  
  // Try to find all textareas
  const textareas = await page.locator('[role="dialog"] textarea').all();
  console.log(`\n=== Found ${textareas.length} textarea fields ===`);
  
  for (let i = 0; i < textareas.length; i++) {
    const textarea = textareas[i];
    const id = await textarea.getAttribute('id');
    const name = await textarea.getAttribute('name');
    const placeholder = await textarea.getAttribute('placeholder');
    
    console.log(`Textarea ${i + 1}:`);
    console.log(`  ID: ${id}`);
    console.log(`  Name: ${name}`);
    console.log(`  Placeholder: ${placeholder}`);
  }
  
  // Try to find all select/combobox elements
  const selects = await page.locator('[role="dialog"] [role="combobox"], [role="dialog"] select').all();
  console.log(`\n=== Found ${selects.length} select/combobox fields ===`);
  
  // Look for labels
  const labels = await page.locator('[role="dialog"] label').all();
  console.log(`\n=== Found ${labels.length} labels ===`);
  
  for (let i = 0; i < Math.min(labels.length, 5); i++) {
    const label = labels[i];
    const text = await label.textContent();
    console.log(`Label ${i + 1}: ${text}`);
  }
});