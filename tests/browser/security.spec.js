const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');

const payload = '<img src=x onerror="window.journalInjected=true">';
const oldSession = {
  id: 'existing-session', productName: payload, method: 'Flower',
  startedAt: '2025-12-23T12:00:00Z', endedAt: '2025-12-23T12:01:00Z',
  elapsedMs: 60000, elapsedSeconds: 60, theme: 'retro',
  moments: [{ text: payload, elapsedSeconds: 12 }],
  highIdeas: [{ text: 'Existing private note', elapsedSeconds: 20 }],
};

test.beforeEach(async ({ page }) => {
  // The app must work even when Google Fonts and all other third parties fail.
  await page.route('https://**/*', route => route.abort());
});

async function openSettings(page) {
  const button = page.getByRole('button', { name: 'Settings', exact: true });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Settings', exact: true })).toBeVisible();
}

async function openHistory(page) {
  await openSettings(page);
  await page.getByRole('button', { name: 'Open previous sessions' }).click();
  await expect(page.getByRole('dialog', { name: 'Session History' })).toBeVisible();
}

test('public pages work at the Pages base path with only same-origin scripts', async ({ page }) => {
  const errors = [];
  const violations = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (/violates.*Content Security Policy|Refused to execute/i.test(message.text())) violations.push(message.text());
  });
  const scripts = [];
  page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()); });
  for (const file of ['', 'about.html', 'privacy.html', 'contact.html']) {
    const response = await page.goto(file || './');
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(scripts.length).toBeGreaterThan(0);
  expect(scripts.every(url => url.startsWith('http://127.0.0.1:18763/BuzzTimer/'))).toBe(true);
  expect(errors).toEqual([]);
  expect(violations).toEqual([]);
});

test('settings use keyboard controls, preserve preference, and restore focus', async ({ page }) => {
  await page.goto('./');
  await openSettings(page);
  await page.getByLabel('Select timer theme').selectOption('retro');
  await page.getByRole('button', { name: 'Save Settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.locator('#activeThemeText')).toContainText('Retro');
  await openSettings(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
});

test('existing history is text-only, survives reload, exports, and needs confirmation to clear', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(session => localStorage.setItem('buzzTimerSessionHistory', JSON.stringify([session])), oldSession);
  await page.reload();
  await openHistory(page);
  await page.locator('.session-history-row').click();
  await expect(page.locator('#sessionHistoryList')).toContainText(payload);
  await expect(page.locator('#sessionHistoryList img')).toHaveCount(0);
  expect(await page.evaluate(() => window.journalInjected)).toBeUndefined();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export history as JSON' }).click();
  const download = await downloaded;
  expect(JSON.parse(await fs.readFile(await download.path(), 'utf8'))).toEqual([oldSession]);
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Clear all saved sessions' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('buzzTimerSessionHistory')))).toEqual([oldSession]);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Clear all saved sessions' }).click();
  await expect(page.getByText('No past sessions yet.')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('buzzTimerSessionHistory')))).toEqual([]);
});

for (const mode of ['getter-denied', 'quota-exceeded']) {
  test(`storage ${mode} warns without crashing the app`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(mode => {
      if (mode === 'getter-denied') {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
      } else {
        Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
      }
    }, mode);
    await page.goto('./');
    await expect(page.locator('#storageWarning')).toContainText('Changes may not survive a reload');
    await openSettings(page);
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });
}

test('missing optional tooltip library does not disable controls', async ({ page }) => {
  await page.route('**/static/vendor/tippy-6.3.7.min.js', route => route.abort());
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await openSettings(page);
  expect(errors).toEqual([]);
});

test('preview does not serve repository internals or permissive CORS', async ({ request }) => {
  for (const file of ['.git/config', '.metadata/.log', '.codex_tmp/apply_hardening.py',
    'node_modules/tippy.js/package.json', 'package-lock.json', 'README.md', 'static/',
    'static/vendor/../../../.git/config', 'static/vendor/..%5c..%5ctools%5cvendor-runtime.js',
    '%2e%2e%5c.git%5cconfig']) {
    const response = await request.get(`http://127.0.0.1:18763/${file}`);
    expect(response.status(), file).toBe(404);
    expect(response.headers()['access-control-allow-origin']).toBeUndefined();
  }
});

test('CSP blocks inline scripts and third-party connections', async ({ page }) => {
  await page.goto('./');
  const result = await page.evaluate(async () => {
    const script = document.createElement('script');
    script.textContent = 'window.inlineInjected = true';
    document.body.append(script);
    let blocked = false;
    try { await fetch('./script.js'); } catch { blocked = true; }
    return { executed: window.inlineInjected === true, blocked };
  });
  expect(result).toEqual({ executed: false, blocked: true });
});

test('rapid drawer reopening cancels old close callbacks and preserves focus', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'High Idea', exact: true }).click();
  await expect(page.getByLabel('Enter your idea')).toBeFocused();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'High Idea', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Enter your idea')).toBeFocused();
  // Wait beyond the old close timeout: it must not hide a reopened drawer.
  await page.waitForTimeout(450);
  await expect(page.getByLabel('Enter your idea')).toBeVisible();
  await expect(page.getByLabel('Enter your idea')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'High Idea', exact: true })).toBeFocused();
});

async function startSession(page, name = 'Regression sample') {
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Session Details', exact: true });
  await dialog.getByLabel('Product Name', { exact: true }).fill(name);
  await dialog.getByLabel('Consumption Method').selectOption('Flower');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('#startBtn')).toHaveAccessibleName('Pause');
}

test('timer and existing session details survive a paused reload', async ({ page }) => {
  await page.goto('./');
  await startSession(page);
  await expect(page.locator('#timer')).not.toHaveText('00:00:00');
  await page.locator('#startBtn').focus();
  await page.keyboard.press('Enter');
  const time = await page.locator('#timer').textContent();
  const active = await page.evaluate(() => JSON.parse(localStorage.getItem('bt_session_active')));
  await page.reload();
  await expect(page.locator('#timer')).toHaveText(time);
  await expect(page.locator('#startBtn')).toHaveAccessibleName('Start');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('bt_session_active')))).toEqual(active);
});

test('journal text, sharing protections, and completed-session archive still work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await startSession(page, payload);
  await page.getByRole('button', { name: 'Log Moment', exact: true }).click();
  await page.getByRole('combobox', { name: 'Enter or select an effect' }).fill(payload);
  await page.getByRole('button', { name: 'Save moment', exact: true }).click();
  await page.getByRole('button', { name: 'High Idea', exact: true }).click();
  await page.getByLabel('Enter your idea').fill(payload);
  await page.getByRole('button', { name: 'Save idea', exact: true }).click();
  await expect(page.locator('.log-list img')).toHaveCount(0);
  expect(await page.evaluate(() => window.journalInjected)).toBeUndefined();
  await page.getByRole('button', { name: 'Share session log', exact: true }).click();
  await page.getByRole('button', { name: 'Detailed Share', exact: true }).click();
  await expect(page.locator('#sharePreview')).toContainText(payload);
  await page.evaluate(() => { window.open = (...args) => { window.openedShare = args; }; });
  await page.getByRole('button', { name: 'Share on Twitter' }).click();
  const opened = await page.evaluate(() => window.openedShare);
  expect(opened[2]).toBe('noopener,noreferrer');
  expect(new URL(opened[0]).searchParams.get('text')).toContain(payload);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('buzzTimerSessionHistory')));
  expect(history).toHaveLength(1);
  expect(history[0].moments[0].text).toBe(payload);
  expect(history[0].highIdeas[0].text).toBe(payload);
  await page.reload();
  await openHistory(page);
  await expect(page.locator('#sessionHistoryList')).toContainText(payload);
  expect(errors).toEqual([]);
});
