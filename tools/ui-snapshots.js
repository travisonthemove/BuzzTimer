const path = require('path');
const fs = require('fs/promises');
const { chromium } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');
const WAIT_AFTER_ACTION_MS = 700;
const SELECTOR_TIMEOUT = 15000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureVisible(page, selector, description) {
  try {
    return await page.waitForSelector(selector, {
      state: 'visible',
      timeout: SELECTOR_TIMEOUT,
    });
  } catch (error) {
    throw new Error(
      `Unable to find ${description || selector} with selector "${selector}": ${error.message}`
    );
  }
}

async function clickRequired(page, selector, description) {
  const handle = await ensureVisible(page, selector, description);
  await handle.click();
  await handle.dispose();
}

async function openThemeSelector(page) {
  const expanded = await page.getAttribute('#themeToggle', 'aria-expanded');
  if (expanded !== 'true') {
    await clickRequired(page, '#themeToggle', 'theme toggle');
    await ensureVisible(page, '#skinSelector:not(.hidden)', 'skin selector panel');
  }
  await ensureVisible(page, '.skin-option[data-skin="classic"]', 'skin option');
}

async function closeThemeSelector(page) {
  const expanded = await page.getAttribute('#themeToggle', 'aria-expanded');
  if (expanded === 'true') {
    await clickRequired(page, '#themeToggle', 'theme toggle');
    await page.waitForFunction(
      () => document.querySelector('#skinSelector')?.classList.contains('hidden')
    );
  }
}

async function selectSkin(page, skinKey) {
  await openThemeSelector(page);
  const optionSelector = `.skin-option[data-skin="${skinKey}"]`;
  await clickRequired(page, optionSelector, `${skinKey} skin option`);
  await delay(WAIT_AFTER_ACTION_MS);
}

async function capture(page, filename) {
  console.log(`Capturing ${filename}`);
  await delay(WAIT_AFTER_ACTION_MS);
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
}

async function gotoHome(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await ensureVisible(page, '#themeToggle', 'theme toggle ready state');
  await delay(WAIT_AFTER_ACTION_MS);
}

async function main() {
  let browser;
  try {
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await gotoHome(page);
    await capture(page, '01-home-classic.png');

    await selectSkin(page, 'calm');
    await capture(page, '02-home-calm.png');

    await selectSkin(page, 'retro');
    await capture(page, '03-home-retro.png');

    await selectSkin(page, 'partyvibe');
    await capture(page, '04-home-party-vibe.png');
    await closeThemeSelector(page);

    console.log('Theme snapshots complete.');
  } catch (error) {
    console.error('UI snapshot script failed:', error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
