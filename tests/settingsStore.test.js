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
    enableBeep: false,
    theme: 'retro',
    historyRetention: 5,
    beepVolume: 0.95,
    announceCadence: '5m',
};

saveSettings(updatedSettings, storage);
const persisted = loadSettings(storage);
assert.strictEqual(persisted.enableBeep, false, 'enableBeep should persist');
assert.strictEqual(persisted.theme, 'retro', 'theme should persist');
assert.strictEqual(persisted.historyRetention, 5, 'history retention should persist');
assert.strictEqual(persisted.beepVolume, 0.95, 'beep volume should persist');
assert.strictEqual(persisted.announceCadence, '5m', 'announce cadence should persist');

// Migration should clamp and normalise unsafe values.
const migrated = migrateSettings({
    enablePulseGlow: 'false',
    enableBeep: 'false',
    beepVolume: '3.2',
    historyRetention: '-2',
    announceCadence: '10m',
    theme: 'unknown',
});

assert.strictEqual(migrated.enablePulseGlow, false, 'enablePulseGlow should coerce to boolean');
assert.strictEqual(migrated.enableBeep, false, 'enableBeep should coerce to boolean');
assert.ok(migrated.beepVolume >= 0 && migrated.beepVolume <= 1, 'beepVolume should be clamped to 0..1');
assert.strictEqual(
    migrated.historyRetention,
    0,
    'historyRetention should clamp to minimum when invalid'
);
assert.strictEqual(
    migrated.announceCadence,
    DEFAULT_SETTINGS.announceCadence,
    'announce cadence should fall back to default when unknown'
);
assert.strictEqual(
    migrated.theme,
    DEFAULT_SETTINGS.theme,
    'theme should fall back to default when unknown'
);

console.log('settingsStore tests passed');

