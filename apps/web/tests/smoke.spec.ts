import { test, expect } from '@playwright/test';

test.describe('Phase 1-4 Smoke Tests', () => {
  test('should successfully load login page (Phase 1)', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText(/login/i);
  });

  test('should load academic timetable (Phase 2)', async ({ page }) => {
    await page.goto('/academics/timetable');
    await expect(page.locator('text=Timetable')).toBeVisible();
  });

  test('should navigate to HR dashboard (Phase 3)', async ({ page }) => {
    await page.goto('/hr');
    await expect(page.locator('text=HR Dashboard')).toBeVisible();
  });

  test('should verify Alumni directory access (Phase 4)', async ({ page }) => {
    await page.goto('/alumni/directory');
    await expect(page.locator('text=Alumni Directory')).toBeVisible();
  });
});
