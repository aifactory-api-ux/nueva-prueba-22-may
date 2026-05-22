import { test, expect, Page } from '@playwright/test';

const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'testpassword123';
const testFullName = 'Test User';

async function registerUser(page: Page, email: string, password: string, fullName: string) {
  await page.goto('/register');
  await page.fill('input[name="fullName"], input[placeholder*="name"], input[id="fullName"]', fullName);
  await page.fill('input[name="email"], input[placeholder*="email"], input[id="email"]', email);
  await page.fill('input[name="password"], input[placeholder*="password"], input[id="password"]', password);
  await page.click('button[type="submit"]');
}

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"], input[placeholder*="email"], input[id="email"]', email);
  await page.fill('input[name="password"], input[placeholder*="password"], input[id="password"]', password);
  await page.click('button[type="submit"]');
}

test.describe('Auth E2E Tests', () => {
  test('should register a new user and hit POST /api/auth/register', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/register') && response.status() === 201
    );

    await registerUser(page, testEmail, testPassword, testFullName);

    const response = await responsePromise;
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('email', testEmail);
    expect(responseBody).toHaveProperty('fullName', testFullName);
  });

  test('should login user and store token in localStorage', async ({ page }) => {
    await page.goto('/login');

    const loginPromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 201
    );

    await page.fill('input[name="email"], input[placeholder*="email"], input[id="email"]', testEmail);
    await page.fill('input[name="password"], input[placeholder*="password"], input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    const response = await loginPromise;
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('accessToken');
    expect(responseBody).toHaveProperty('refreshToken');
    expect(responseBody).toHaveProperty('expiresIn');

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe(responseBody.accessToken);
  });

  test('should access protected route with Authorization header', async ({ page }) => {
    await loginUser(page, testEmail, testPassword);

    await page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 201
    );

    let authHeaderSent = false;

    page.on('request', (request) => {
      if (request.url().includes('/api/auth/me')) {
        const authHeader = request.headers()['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          authHeaderSent = true;
        }
      }
    });

    const mePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/me') && response.status() === 200
    );

    await page.goto('/historial-de-pedidos');
    await mePromise;

    expect(authHeaderSent).toBe(true);
  });

  test('should logout and clear localStorage', async ({ page }) => {
    await loginUser(page, testEmail, testPassword);

    await page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 201
    );

    const tokenBeforeLogout = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenBeforeLogout).toBeTruthy();

    const logoutButton = page.locator('button[class*="logout"], button:has-text("Logout"), button:has-text("Cerrar sesión")').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }

    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfterLogout).toBeNull();
  });
});