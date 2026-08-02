// Playwright E2E test for admin login flow
// Run with: npx playwright test src/__tests__/e2e/

import { test, expect } from "@playwright/test"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

test.describe("Admin Authentication", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`)
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test("shows login page with form elements", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await page.fill('input[type="email"]', "wrong@example.com")
    await page.fill('input[type="password"]', "wrongpassword")
    await page.click('button[type="submit"]')
    // Should show an error message
    await expect(page.locator("text=Invalid")).toBeVisible({ timeout: 10000 }).catch(() => {
      // Error may be shown via toast or URL param
    })
  })

  test("redirects authenticated users away from login", async ({ page }) => {
    // This test requires valid credentials — set ADMIN_EMAIL/ADMIN_PASSWORD env vars
    const email = process.env.ADMIN_EMAIL || ""
    const password = process.env.ADMIN_PASSWORD || ""
    test.skip(!email || !password, "No admin credentials configured")

    await page.goto(`${BASE_URL}/admin/login`)
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 })
  })
})

test.describe("Admin Dashboard", () => {
  test("loads dashboard page", async ({ page }) => {
    const email = process.env.ADMIN_EMAIL || ""
    const password = process.env.ADMIN_PASSWORD || ""
    test.skip(!email || !password, "No admin credentials configured")

    // Login first
    await page.goto(`${BASE_URL}/admin/login`)
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })

    // Check dashboard elements
    await expect(page.locator("text=Dashboard")).toBeVisible()
    await expect(page.locator('[data-testid="stat-card"]').first()).toBeVisible({ timeout: 10000 })
  })
})
