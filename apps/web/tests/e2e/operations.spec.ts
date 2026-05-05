import { test, expect } from '@playwright/test';

test.describe('Operations Workflows', () => {

  test('Leave Application Flow', async ({ page }) => {
    // Mock login and HR dashboard
    await page.route('**/auth/me', route => route.fulfill({
      status: 200,
      json: { id: 'admin-1', role: 'HR_STAFF', employeeId: 'emp-1' }
    }));
    await page.route('**/hr/employees', route => route.fulfill({ status: 200, json: [] }));
    await page.route('**/hr/leave-requests', route => route.fulfill({ status: 200, json: [] }));
    
    await page.goto('/dashboard/hr');
    
    // Apply for leave
    await page.click('button:has-text("Apply Leave")');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    await page.fill('input[type="date"]', '2024-10-01');
    // For end date we have multiple date inputs, let's select by label or index
    const dateInputs = await page.locator('input[type="date"]').all();
    if (dateInputs.length > 1) {
      await dateInputs[1].fill('2024-10-05');
    }
    
    await page.fill('input[placeholder="Brief reason for leave"]', 'Sick leave');
    
    // Intercept apply request
    await page.route('**/hr/leave-requests', route => route.fulfill({ status: 201, json: { id: 'req-1' } }));
    await page.click('button:has-text("Submit Application")');
    
    await expect(page.getByText('Leave application submitted!')).toBeVisible();
  });

  test('Library Issue/Return Flow', async ({ page }) => {
    await page.route('**/auth/me', route => route.fulfill({
      status: 200,
      json: { id: 'admin-1', role: 'LIBRARIAN' }
    }));
    await page.route('**/library/books', route => route.fulfill({ status: 200, json: [] }));
    await page.route('**/library/recent-issues', route => route.fulfill({ status: 200, json: [] }));

    await page.goto('/dashboard/library');

    // Issue Book
    await page.click('button:has-text("Issue/Return")');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.fill('input[placeholder="e.g., BK-1234"]', 'BK-9999');
    await page.fill('input[placeholder="e.g., student-uuid"]', 'student-1');

    await page.route('**/library/issue', route => route.fulfill({ status: 201, json: {} }));
    await page.click('button:has-text("Confirm Issue")');

    await expect(page.getByText('Book issued successfully!')).toBeVisible();
  });

  test('Placement Drive Application', async ({ page }) => {
    await page.route('**/auth/me', route => route.fulfill({
      status: 200,
      json: { id: 'student-1', role: 'STUDENT' }
    }));
    
    await page.route('**/placement/drives', route => route.fulfill({
      status: 200,
      json: [{ id: 'drive-1', companyName: 'Google', date: '2024-11-01', _count: { applications: 0 } }]
    }));
    await page.route('**/placement/stats', route => route.fulfill({ status: 200, json: {} }));

    await page.goto('/dashboard/placement');

    // Apply for Drive
    await page.click('button:has-text("Apply Now")');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.fill('input[placeholder="https://drive.google.com/..."]', 'https://resume.url');

    await page.route('**/placement/apply', route => route.fulfill({ status: 201, json: {} }));
    await page.click('button:has-text("Submit Application")');

    await expect(page.getByText('Applied successfully!')).toBeVisible();
  });
});
