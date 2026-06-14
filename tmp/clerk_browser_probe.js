const fs = require('fs');
const path = require('path');
const os = require('os');
const { chromium } = require('playwright');

function safeCopy(src, dst) {
  try {
    if (!fs.existsSync(src)) return false;
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    return true;
  } catch (e) {
    console.log('skip copy', src, String(e.message || e));
    return false;
  }
}

function buildProfile() {
  const sourceRoot = 'C:/Users/deej/AppData/Local/Google/Chrome/User Data';
  const tempRoot = path.join(os.tmpdir(), 'krasus-chrome-cookie-profile');
  fs.rmSync(tempRoot, { recursive: true, force: true });
  fs.mkdirSync(tempRoot, { recursive: true });

  const rootFiles = ['Local State', 'First Run'];
  const profileFiles = [
    'Preferences',
    'Secure Preferences',
    'Network/Cookies',
    'Network/Cookies-journal',
    'Network/Device Bound Sessions',
    'Network/Device Bound Sessions-journal',
    'Login Data',
    'Login Data For Account',
    'Web Data',
    'Account Web Data',
    'Bookmarks'
  ];

  for (const file of rootFiles) safeCopy(path.join(sourceRoot, file), path.join(tempRoot, file));
  for (const file of profileFiles) safeCopy(path.join(sourceRoot, 'Default', file), path.join(tempRoot, 'Default', file));
  return tempRoot;
}

(async () => {
  console.log('probe start');
  const userDataDir = buildProfile();
  console.log('profile ready', userDataDir);
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    args: ['--profile-directory=Default'],
  });
  console.log('context launched');
  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://dashboard.clerk.com/apps/app_2bUQvRVTfSKVJsY6I5nCUIywvnu/instances/ins_3EQQGbJZ2Ao4NqaVjaOn5yE8ImJ/api-keys', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(4000);
  console.log('TITLE:', await page.title());
  console.log('URL:', page.url());
  const out = 'C:/Users/deej/repos/deejpotter/tmp/clerk_probe.png';
  await page.screenshot({ path: out, fullPage: true });
  console.log('SCREENSHOT:', out);
  await context.close();
  console.log('probe done');
})().catch(err => { console.error('ERR', err); process.exit(1); });
