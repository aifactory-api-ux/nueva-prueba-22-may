import { test, expect, Page } from '@playwright/test';

const testEmail = `carttest_${Date.now()}@example.com`;
const testPassword = 'testpassword123';
const testFullName = 'Cart Test User';

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"], input[placeholder*="email"], input[id="email"]', email);
  await page.fill('input[name="password"], input[placeholder*="password"], input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForResponse(
    (response) => response.url().includes('/api/auth/login') && response.status() === 201
  );
}

async function registerAndLogin(page: Page) {
  const registerPromise = page.waitForResponse(
    (response) => response.url().includes('/api/auth/register') && response.status() === 201
  );
  await page.goto('/register');
  await page.fill('input[name="fullName"], input[placeholder*="name"], input[id="fullName"]', testFullName);
  await page.fill('input[name="email"], input[placeholder*="email"], input[id="email"]', testEmail);
  await page.fill('input[name="password"], input[placeholder*="password"], input[id="password"]', testPassword);
  await page.click('button[type="submit"]');
  await registerPromise;
  await loginUser(page, testEmail, testPassword);
}

async function addProductToCart(page: Page, productSelector: string = '[data-testid="product-card"], .product-card, [class*="product"]') {
  await page.goto('/catalogo-productos');
  await page.waitForResponse(
    (response) => response.url().includes('/api/products') && response.status() === 200
  );

  const addButton = page.locator('button:has-text("Add to cart"), button:has-text("Añadir al carrito"), button:has-text("Agregar")').first();
  if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await addButton.click();
  } else {
    const productCard = page.locator(productSelector).first();
    if (await productCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await productCard.click();
      const detailAddButton = page.locator('button:has-text("Add to cart"), button:has-text("Añadir al carrito"), button:has-text("Agregar")').first();
      if (await detailAddButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await detailAddButton.click();
      }
    }
  }
}

test.describe('Cart E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page);
  });

  test('should add product to cart and hit POST /api/cart/items', async ({ page }) => {
    const cartResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.status() === 201
    );

    await addProductToCart(page);

    const cartResponse = await cartResponsePromise;
    expect([200, 201]).toContain(cartResponse.status());

    const cartBody = await cartResponse.json();
    expect(cartBody).toHaveProperty('items');
    expect(Array.isArray(cartBody.items)).toBe(true);
  });

  test('should update cart item quantity and hit PUT /api/cart/items/:productId', async ({ page }) => {
    const addCartPromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && (response.status() === 200 || response.status() === 201)
    );
    await addProductToCart(page);
    await addCartPromise;

    await page.goto('/carrito-de-compras');
    await page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.status() === 200
    );

    const quantityInput = page.locator('input[type="number"], input[class*="quantity"], input[id*="quantity"]').first();
    if (await quantityInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const updateResponsePromise = page.waitForResponse(
        (response) => response.url().match(/\/api\/cart\/items\/[a-f0-9]+/i) !== null && response.status() === 200
      );

      await quantityInput.fill('3');
      await quantityInput.press('Enter');

      const updateResponse = await updateResponsePromise;
      expect(updateResponse.status()).toBe(200);

      const updateBody = await updateResponse.json();
      expect(updateBody).toHaveProperty('items');
    }
  });

  test('should remove item from cart and hit DELETE /api/cart/items/:productId', async ({ page }) => {
    const addCartPromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && (response.status() === 200 || response.status() === 201)
    );
    await addProductToCart(page);
    await addCartPromise;

    await page.goto('/carrito-de-compras');
    await page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.status() === 200
    );

    const removeButton = page.locator('button:has-text("Remove"), button:has-text("Eliminar"), button:has-text("Quitar"), button[class*="remove"]').first();
    if (await removeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const deleteResponsePromise = page.waitForResponse(
        (response) => response.url().match(/\/api\/cart\/items\/[a-f0-9]+/i) !== null && response.status() === 204
      );

      await removeButton.click();

      const deleteResponse = await deleteResponsePromise;
      expect(deleteResponse.status()).toBe(204);
    }
  });

  test('should display cart items in DOM after adding', async ({ page }) => {
    const addCartPromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && (response.status() === 200 || response.status() === 201)
    );
    await addProductToCart(page);
    await addCartPromise;

    await page.goto('/carrito-de-compras');
    const cartResponse = await page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.status() === 200
    );
    expect(cartResponse.status()).toBe(200);

    const cartItems = page.locator('[data-testid="cart-item"], .cart-item, [class*="cart-item"], li[class*="item"]');
    const count = await cartItems.count();
    expect(count).toBeGreaterThan(0);
  });
});