(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        global.SettingsStore = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    const SETTINGS_STORAGE_KEY = 'bt:v1:settings';
    const THEME_OPTIONS = ['classic', 'calm', 'retro', 'partyvibe'];
    const ANNOUNCE_OPTIONS = ['off', '1m', '5m'];

    const DEFAULT_SETTINGS = Object.freeze({
        theme: 'classic',
        enablePulseGlow: true,
        enableBeep: true,
        beepVolume: 0.6,
        autoStart: true,
        confirmReset: true,
        reduceMotionRespect: true,
        historyRetention: 10,
        announceCadence: '1m',
        version: 1,
    });

    const clamp = (value, min, max) => {
        if (Number.isNaN(value)) {
            return min;
        }
        return Math.min(Math.max(value, min), max);
    };

    const toBoolean = (value, fallback) => {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'true') return true;
            if (normalized === 'false') return false;
        }
        if (typeof value === 'number') {
            if (Number.isNaN(value)) return fallback;
            return value !== 0;
        }
        return fallback;
    };

    const pickTheme = (perhapsTheme) => {
        if (THEME_OPTIONS.includes(perhapsTheme)) {
            return perhapsTheme;
        }
        return DEFAULT_SETTINGS.theme;
    };

    const pickAnnounce = (value) => {
        if (ANNOUNCE_OPTIONS.includes(value)) {
            return value;
        }
        return DEFAULT_SETTINGS.announceCadence;
    };

    const normalizeSettings = (input) => {
        const base = { ...DEFAULT_SETTINGS };
        if (!input || typeof input !== 'object') {
            return base;
        }

        const result = { ...base };

        if ('theme' in input) {
            result.theme = pickTheme(input.theme);
        }
        if ('enablePulseGlow' in input) {
            result.enablePulseGlow = toBoolean(input.enablePulseGlow, base.enablePulseGlow);
        }
        if ('enableBeep' in input) {
            result.enableBeep = toBoolean(input.enableBeep, base.enableBeep);
        }
        if ('beepVolume' in input) {
            const volume = typeof input.beepVolume === 'string'
                ? parseFloat(input.beepVolume)
                : Number(input.beepVolume);
            result.beepVolume = clamp(Number.isFinite(volume) ? volume : base.beepVolume, 0, 1);
        }
        if ('autoStart' in input) {
            result.autoStart = toBoolean(input.autoStart, base.autoStart);
        }
        if ('confirmReset' in input) {
            result.confirmReset = toBoolean(input.confirmReset, base.confirmReset);
        }
        if ('reduceMotionRespect' in input) {
            result.reduceMotionRespect = toBoolean(
                input.reduceMotionRespect,
                base.reduceMotionRespect
            );
        }
        if ('historyRetention' in input) {
            const retention = typeof input.historyRetention === 'string'
                ? parseInt(input.historyRetention, 10)
                : Number(input.historyRetention);
            result.historyRetention = clamp(
                Number.isFinite(retention) ? retention : base.historyRetention,
                0,
                50
            );
        }
        if ('announceCadence' in input) {
            result.announceCadence = pickAnnounce(input.announceCadence);
        }

        result.version = 1;
        return result;
    };

    const migrateSettings = (raw) => {
        const source = raw && typeof raw === 'object' ? raw : {};
        return normalizeSettings({ ...DEFAULT_SETTINGS, ...source });
    };

    const getDefaultStorage = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
            return globalThis.localStorage;
        }
        return null;
    };

    const loadSettings = (storage = getDefaultStorage(), options = {}) => {
        const { legacyLoader, onMigrate } = options;
        let raw = null;

        if (storage && typeof storage.getItem === 'function') {
            try {
                raw = storage.getItem(SETTINGS_STORAGE_KEY);
            } catch {
                raw = null;
            }
        }

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                return migrateSettings(parsed);
            } catch {
                // fall through to legacy/default handling
            }
        }

        if (typeof legacyLoader === 'function') {
            try {
                const legacySettings = legacyLoader();
                const migrated = migrateSettings({ ...DEFAULT_SETTINGS, ...legacySettings });
                saveSettings(migrated, storage);
                if (typeof onMigrate === 'function') {
                    onMigrate(migrated);
                }
                return migrated;
            } catch {
                // ignore legacy errors and use defaults
            }
        }

        return { ...DEFAULT_SETTINGS };
    };

    const saveSettings = (settings, storage = getDefaultStorage(), options = {}) => {
        const normalized = migrateSettings(settings);
        if (storage && typeof storage.setItem === 'function') {
            try {
                storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
            } catch {
                // ignore persistence errors
            }
        }

        if (options.dispatch && typeof options.dispatch === 'function') {
            try {
                options.dispatch(normalized);
            } catch {
                // ignore dispatch errors
            }
        }

        return normalized;
    };

    const createMemoryStorage = (initial = {}) => {
        const store = { ...initial };
        return {
            getItem: (key) => {
                if (Object.prototype.hasOwnProperty.call(store, key)) {
                    return store[key];
                }
                return null;
            },
            setItem: (key, value) => {
                store[key] = String(value);
            },
            removeItem: (key) => {
                delete store[key];
            },
            dump: () => ({ ...store }),
        };
    };

    return {
        SETTINGS_STORAGE_KEY,
        DEFAULT_SETTINGS,
        normalizeSettings,
        migrateSettings,
        loadSettings,
        saveSettings,
        createMemoryStorage,
    };
});

