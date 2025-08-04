import { test, expect } from '@playwright/test';

test.describe('UI Verification After Removal', () => {
  test('homepage should not have blank sections', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that main sections are visible
    await expect(page.locator('h1:has-text("Transform Your")')).toBeVisible();
    await expect(page.locator('h2:has-text("Featured Collections")')).toBeVisible();
    
    // Take screenshot of the full page
    await page.screenshot({ 
      path: 'screenshots/homepage-after-removal-full.png', 
      fullPage: true 
    });
    
    // Scroll to middle of page and take screenshot
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(1000); // Wait for any animations
    await page.screenshot({ 
      path: 'screenshots/homepage-after-removal-middle.png' 
    });
    
    // Scroll to bottom and take screenshot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/homepage-after-removal-bottom.png' 
    });
    
    // Check that there are no large blank spaces
    const viewportHeight = await page.viewportSize()?.height || 800;
    const sections = await page.locator('section').all();
    
    for (const section of sections) {
      const box = await section.boundingBox();
      if (box) {
        // Check that section height is reasonable (not a huge blank space)
        // Allow up to 2.5x viewport height for sections with lots of content
        expect(box.height).toBeLessThan(viewportHeight * 2.5);
      }
    }
  });
  
  test('verify no try-on links exist', async ({ page }) => {
    await page.goto('/');
    
    // Check that no try-on links exist
    const tryOnLinks = await page.locator('a[href*="try-on"]').count();
    expect(tryOnLinks).toBe(0);
    
    // Check that no try-on text exists in navigation
    const tryOnText = await page.locator('text=/virtual.*try.*on/i').count();
    expect(tryOnText).toBe(0);
  });
});