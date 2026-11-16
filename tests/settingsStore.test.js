const assert = require('assert');

const {
    DEFAULT_SETTINGS,
    migrateSettings,
    loadSettings,
    saveSettings,
    createMemoryStorage,
} = require('../settingsStore.js');

const storage = createMemoryStorage();

// When storage is empty we should get defaults without throwing.
const loadedDefaults = loadSettings(storage);
assert.deepStrictEqual(
    loadedDefaults,
    DEFAULT_SETTINGS,
    'loadSettings should return default settings when storage is empty'
);

// Persist a custom configuration and ensure it round-trips correctly.
const updatedSettings = {
    ...loadedDefaults,
    enablePulseGlow: false,
    theme: 'retro',
    historyRetention: 5,
};

saveSettings(updatedSettings, storage);
const persisted = loadSettings(storage);
assert.strictEqual(persisted.enablePulseGlow, false, 'enablePulseGlow should persist');
assert.strictEqual(persisted.theme, 'retro', 'theme should persist');
assert.strictEqual(persisted.historyRetention, 5, 'history retention should persist');
// Migration should clamp and normalise unsafe values.
const migrated = migrateSettings({
    enablePulseGlow: 'false',
    historyRetention: '-2',
    theme: 'unknown',
});

assert.strictEqual(migrated.enablePulseGlow, false, 'enablePulseGlow should coerce to boolean');
assert.strictEqual(
    migrated.historyRetention,
    0,
    'historyRetention should clamp to minimum when invalid'
);
assert.strictEqual(
    migrated.theme,
    DEFAULT_SETTINGS.theme,
    'theme should fall back to default when unknown'
);

// Privacy settings can deny the localStorage getter before getItem is called.
const fs = require('node:fs');
const vm = require('node:vm');
const deniedWindow = {};
Object.defineProperty(deniedWindow, 'localStorage', {
    get() { throw new Error('Storage denied'); },
});
const isolated = { module: { exports: {} }, window: deniedWindow };
vm.runInNewContext(fs.readFileSync(require.resolve('../settingsStore.js'), 'utf8'), isolated);
assert.strictEqual(isolated.module.exports.loadSettings().theme, 'classic');
assert.strictEqual(isolated.module.exports.saveSettings({ theme: 'retro' }).theme, 'retro');

const failingStorage = {
    getItem() { throw new Error('Read denied'); },
    setItem() { throw new Error('Quota exceeded'); },
};
assert.strictEqual(loadSettings(failingStorage).theme, 'classic');
assert.doesNotThrow(() => saveSettings(updatedSettings, failingStorage));
console.log('settingsStore tests passed, including denied storage');
