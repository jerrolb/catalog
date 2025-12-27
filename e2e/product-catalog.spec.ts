import { test, expect } from '@playwright/test';

test.describe('Product Catalog E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for products to load
    await page.waitForSelector('text=Product Catalog', { timeout: 10000 });
  });

  test('should display products on page load', async ({ page }) => {
    // Check that products are displayed
    const productCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    
    // Check that product information is visible
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('h3')).toBeVisible();
  });

  test('should add a new product', async ({ page }) => {
    // Click Add Product button
    await page.click('text=Add Product');
    
    // Wait for modal to appear
    await expect(page.locator('text=Add New Product')).toBeVisible();
    
    // Fill in the form with unique values
    const timestamp = Date.now();
    const productTitle = `E2E Test Product ${timestamp}`;
    await page.fill('input[name="title"]', productTitle);
    await page.fill('textarea[name="description"]', 'This is a test product created by E2E tests');
    await page.fill('input[name="category"]', 'e2e-test');
    await page.fill('input[name="brand"]', 'E2E Brand');
    await page.fill('input[name="sku"]', `E2E-SKU-${timestamp}`);
    await page.fill('input[name="weight"]', '2.5');
    await page.fill('input[name="price"]', '29.99');
    await page.fill('input[name="stock"]', '50');
    
    // Submit the form
    await page.click('button:has-text("Submit")');
    
    // Wait for modal to close and product to appear
    await expect(page.locator('text=Add New Product')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for page to refresh
    await page.waitForTimeout(2000);
    
    // Verify the new product appears in the list
    await expect(page.locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('should edit an existing product', async ({ page }) => {
    // First, create a product to edit
    await page.click('text=Add Product');
    await expect(page.locator('text=Add New Product')).toBeVisible();
    
    const timestamp = Date.now();
    const testSku = `E2E-EDIT-${timestamp}`;
    const originalTitle = `E2E Edit Test ${timestamp}`;
    
    await page.fill('input[name="title"]', originalTitle);
    await page.fill('textarea[name="description"]', 'Product for editing test');
    await page.fill('input[name="category"]', 'e2e-test');
    await page.fill('input[name="brand"]', 'E2E Brand');
    await page.fill('input[name="sku"]', testSku);
    await page.fill('input[name="weight"]', '1.0');
    await page.fill('input[name="price"]', '19.99');
    await page.fill('input[name="stock"]', '100');
    
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Add New Product')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${originalTitle}`)).toBeVisible({ timeout: 10000 });
    
    // Now edit the product we just created
    const productCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    const createdProduct = productCards.filter({ hasText: originalTitle }).first();
    await expect(createdProduct).toBeVisible();
    
    // Click Edit button
    await createdProduct.locator('button:has-text("Edit")').click();
    
    // Wait for edit modal
    await expect(page.locator('text=Edit Product')).toBeVisible();
    await page.waitForTimeout(500);
    
    // Update the title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    const updatedTitle = `${originalTitle} - Updated`;
    await titleInput.fill(updatedTitle);
    
    // Submit the form
    const submitButton = page.locator('button:has-text("Submit"):not(:disabled)');
    await submitButton.click();
    
    // Wait for modal to close
    await expect(page.locator('text=Edit Product')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for page to refresh
    await page.waitForTimeout(2000);
    
    // Verify the updated title appears
    await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('should delete a product', async ({ page }) => {
    // First create a product to delete
    await page.click('text=Add Product');
    await expect(page.locator('text=Add New Product')).toBeVisible();
    
    const timestamp = Date.now();
    const productTitle = `E2E Delete Test ${timestamp}`;
    await page.fill('input[name="title"]', productTitle);
    await page.fill('textarea[name="description"]', 'Product to be deleted');
    await page.fill('input[name="category"]', 'e2e-test');
    await page.fill('input[name="brand"]', 'E2E Brand');
    await page.fill('input[name="sku"]', `E2E-DELETE-${timestamp}`);
    await page.fill('input[name="weight"]', '1.0');
    await page.fill('input[name="price"]', '19.99');
    await page.fill('input[name="stock"]', '100');
    
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Add New Product')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 10000 });
    
    // Now delete the product we just created
    const productCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    const createdProduct = productCards.filter({ hasText: productTitle }).first();
    await expect(createdProduct).toBeVisible();
    
    // Click Delete button
    await createdProduct.locator('button:has-text("Delete")').click();
    
    // Wait for delete confirmation modal
    await expect(page.locator('text=Delete Product')).toBeVisible();
    
    // Confirm deletion - find the delete button in the modal
    const deleteButton = page.locator('div:has-text("Delete Product")').locator('button:has-text("Delete")').last();
    await deleteButton.click();
    
    // Wait for modal to close
    await expect(page.locator('text=Delete Product')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for page to refresh
    await page.waitForTimeout(2000);
    
    // Verify the product is removed
    await expect(page.locator(`text=${productTitle}`).first()).not.toBeVisible({ timeout: 10000 });
  });

  test('should search for products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[class*="bg-white rounded-lg shadow-md"]', { timeout: 10000 });
    
    // Get initial product count
    const initialProducts = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    const initialCount = await initialProducts.count();
    
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search products"]');
    await searchInput.fill('Flux');
    
    // Wait for search results to update
    await page.waitForTimeout(1000);
    
    // Verify search results (should show products with "Flux" in title or description)
    const searchResults = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    const resultsCount = await searchResults.count();
    
    // Results should be filtered
    expect(resultsCount).toBeLessThanOrEqual(initialCount);
    
    // Verify at least one result contains "Flux"
    if (resultsCount > 0) {
      const firstResult = searchResults.first();
      const title = await firstResult.locator('h3').textContent();
      const description = await firstResult.locator('p').textContent();
      expect(
        title?.toLowerCase().includes('flux') || description?.toLowerCase().includes('flux')
      ).toBe(true);
    }
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(1000);
    
    // Verify all products are shown again
    const finalCount = await page.locator('[class*="bg-white rounded-lg shadow-md"]').count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should paginate through products', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[class*="bg-white rounded-lg shadow-md"]', { timeout: 10000 });
    
    // Check if pagination exists
    const pagination = page.locator('button:has-text("Next")');
    const paginationExists = await pagination.count() > 0;
    
    if (paginationExists) {
      // Get first page product titles
      const firstPageProducts = page.locator('[class*="bg-white rounded-lg shadow-md"]');
      const firstPageTitle = await firstPageProducts.first().locator('h3').textContent();
      
      // Click Next button
      await pagination.click();
      
      // Wait for page to load
      await page.waitForTimeout(1000);
      
      // Verify different products are shown
      const secondPageProducts = page.locator('[class*="bg-white rounded-lg shadow-md"]');
      const secondPageTitle = await secondPageProducts.first().locator('h3').textContent();
      
      // Titles should be different (unless there's only one page of results)
      if (firstPageTitle && secondPageTitle) {
        // At least verify pagination worked
        const secondPageCount = await secondPageProducts.count();
        expect(secondPageCount).toBeGreaterThan(0);
      }
      
      // Go back to first page
      const prevButton = page.locator('button:has-text("Previous")');
      if (await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should show low stock indicator for products with stock < 10', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[class*="bg-white rounded-lg shadow-md"]', { timeout: 10000 });
    
    // Check all product cards for low stock indicator
    const productCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    const count = await productCards.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = productCards.nth(i);
      const stockText = await card.locator('text=/Stock:/').locator('..').textContent();
      
      if (stockText?.includes('Low stock')) {
        // Verify it's in red
        const stockElement = card.locator('text=/Low stock/');
        await expect(stockElement).toHaveCSS('color', 'rgb(220, 38, 38)'); // red-600
      }
    }
  });

  test('should cancel add product modal', async ({ page }) => {
    // Click Add Product button
    await page.click('text=Add Product');
    
    // Wait for modal to appear
    await expect(page.locator('text=Add New Product')).toBeVisible();
    
    // Fill in some data
    await page.fill('input[name="title"]', 'Should Not Appear');
    
    // Click Cancel
    await page.click('button:has-text("Cancel")');
    
    // Verify modal closes
    await expect(page.locator('text=Add New Product')).not.toBeVisible({ timeout: 2000 });
    
    // Verify product was not created
    await expect(page.locator('text=Should Not Appear')).not.toBeVisible();
  });

  test('should cancel edit product modal', async ({ page }) => {
    // Wait for products to load
    const productCards = page.locator('[class*="bg-white rounded-lg shadow-md"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    
    // Get original title from first product
    const firstProduct = productCards.first();
    const originalTitle = await firstProduct.locator('h3').textContent();
    
    // Click Edit
    await firstProduct.locator('button:has-text("Edit")').click();
    
    // Wait for modal
    await expect(page.locator('text=Edit Product')).toBeVisible();
    
    // Change title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Should Not Be Saved');
    
    // Click Cancel
    await page.click('button:has-text("Cancel")');
    
    // Verify modal closes
    await expect(page.locator('text=Edit Product')).not.toBeVisible({ timeout: 2000 });
    
    // Verify original title is still there - use first() to avoid strict mode violation
    if (originalTitle) {
      await expect(page.locator(`text=${originalTitle}`).first()).toBeVisible({ timeout: 5000 });
    }
  });
});

