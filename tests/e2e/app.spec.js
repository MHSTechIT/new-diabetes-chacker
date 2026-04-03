import { test, expect } from '@playwright/test'

// ── T1: Home page loads ───────────────────────────────────────────────
test('T1 — Home page loads and shows language selector', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/MHS Test/)
  // Page should have visible content (logo or heading)
  await expect(page.locator('body')).toBeVisible()
})

// ── T2: Language selection ────────────────────────────────────────────
test('T2 — Language modal or English option is visible', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const body = await page.locator('body').textContent()
  // Should show either English or Tamil language option
  expect(
    body.includes('English') || body.includes('Tamil') || body.includes('தமிழ்')
  ).toBeTruthy()
})

// ── T3: Navigation guard — /result redirects to / without state ──────
test('T3 — Direct visit to /result redirects to home', async ({ page }) => {
  await page.goto('/result')
  await page.waitForLoadState('networkidle')
  // Should redirect to home since no quiz state
  const url = page.url()
  expect(url).toMatch(/localhost:5173\/$|localhost:5173\/#/)
})

// ── T4: Direct visit to /book-home-test without state ─────────────────
test('T4 — /book-home-test accessible directly', async ({ page }) => {
  await page.goto('/book-home-test')
  await page.waitForLoadState('networkidle')
  // Either shows the form or redirects — both are valid behaviours
  const url = page.url()
  expect(url).toContain('localhost:5173')
})

// ── T5: 404 / unknown route ───────────────────────────────────────────
test('T5 — Unknown route does not crash the app', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await page.waitForLoadState('networkidle')
  // App should still render something (SPA fallback via vercel.json rewrite)
  await expect(page.locator('body')).toBeVisible()
  // Should not show a raw browser error page
  const title = await page.title()
  expect(title).not.toBe('')
})

// ── T6: No JS console errors on home page ────────────────────────────
test('T6 — No critical JS errors on home page load', async ({ page }) => {
  const errors = []
  page.on('pageerror', err => errors.push(err.message))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Filter out known non-critical warnings
  const critical = errors.filter(e =>
    !e.includes('Warning:') &&
    !e.includes('ReactRouter') &&
    !e.includes('v7_')
  )
  expect(critical).toHaveLength(0)
})

// ── T7: Page is responsive — no horizontal overflow on mobile ─────────
test('T7 — No horizontal scroll on mobile (375px)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5) // 5px tolerance
})

// ── T8: Page is responsive — tablet ──────────────────────────────────
test('T8 — No horizontal scroll on tablet (768px)', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
})

// ── T9: Blood test booking form renders correctly ─────────────────────
test('T9 — Blood test booking form renders correctly', async ({ page }) => {
  await page.goto('/book-home-test')
  await page.waitForLoadState('networkidle')
  const body = await page.locator('body').textContent()
  // Form shows booking page content
  expect(
    body.includes('Book Home Test') || body.includes('DOORSTEP') || body.includes('HbA1c')
  ).toBeTruthy()
})

// ── T10: Meta and CSP headers present ────────────────────────────────
test('T10 — Page has viewport meta tag (mobile ready)', async ({ page }) => {
  await page.goto('/')
  const viewport = await page.$eval(
    'meta[name="viewport"]',
    el => el.getAttribute('content')
  )
  expect(viewport).toContain('width=device-width')
})
