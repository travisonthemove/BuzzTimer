'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const forbidden = [
  /(^|\/)(node_modules|\.metadata|\.codex_tmp|\.aws|test-results|playwright-report)(\/|$)/,
  /(^|\/)(\.project|\.classpath|\.npmrc|\.netrc)$/,
  /(^|\/)\.env(?:$|\.(?!(?:example|sample)$))/, /\.(?:pem|key|log)$/i,
  /(^|\/)buzz-timer-(?:history.*|session-.*)\.json$/,
];
const failures = tracked.filter(file => forbidden.some(rule => rule.test(file)));
if (failures.length) {
  // File paths only; never print file contents or credential values.
  console.error('Remove these local/development files from Git tracking:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Repository hygiene passed for ${tracked.length} tracked paths. This is not a secret-content scan.`);
}
