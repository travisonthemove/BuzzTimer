document.addEventListener('DOMContentLoaded', () => {
    const normalizeString = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
    const coerceExplicitFlag = (value) => {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (!normalized) {
                return null;
            }
            if (['1', 'true', 'yes', 'on', 'dev', 'debug'].includes(normalized)) {
                return true;
            }
            if (['0', 'false', 'no', 'off', 'prod', 'production'].includes(normalized)) {
                return false;
            }
        }
        return null;
    };
    const readQueryFlag = () => {
        if (typeof window === 'undefined' || !window.location || typeof window.location.search !== 'string') {
            return null;
        }
        try {
            const params = new URLSearchParams(window.location.search);
            const raw = params.get('btDev') ?? params.get('bt-dev') ?? params.get('debug') ?? params.get('dev');
            return coerceExplicitFlag(raw);
        } catch (error) {
            return null;
        }
    };
    const readStorageFlag = () => {
        if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
            return null;
        }
        try {
            return coerceExplicitFlag(window.localStorage.getItem('bt:dev'));
        } catch (storageError) {
            return null;
        }
    };
    const datasetEnv = normalizeString(document?.documentElement?.dataset?.env);
    const metaEnvContent = normalizeString(document?.querySelector('meta[name="buzz:env"]')?.getAttribute('content'));
    const windowEnv = normalizeString(typeof window !== 'undefined' && typeof window.__BUZZTIMER_ENV__ === 'string' ? window.__BUZZTIMER_ENV__ : '');
    const nodeEnv = normalizeString((typeof process !== 'undefined' && process && process.env && typeof process.env.NODE_ENV === 'string')
        ? process.env.NODE_ENV
        : '');
    const explicitWindowFlag = coerceExplicitFlag(typeof window !== 'undefined' ? window.__BUZZTIMER_DEV__ : undefined);
    const queryFlag = readQueryFlag();
    const storageFlag = readStorageFlag();

    // Determine dev mode using explicit overrides before falling back to host heuristics.
    let __DEV__ = false;

    if (explicitWindowFlag !== null) {
        __DEV__ = explicitWindowFlag;
    } else if (queryFlag !== null) {
        __DEV__ = queryFlag;
    } else if (storageFlag !== null) {
        __DEV__ = storageFlag;
    } else if (datasetEnv) {
        __DEV__ = datasetEnv !== 'production';
    } else if (windowEnv) {
        __DEV__ = windowEnv !== 'production';
    } else if (metaEnvContent) {
        __DEV__ = metaEnvContent !== 'production';
    } else if (nodeEnv) {
        __DEV__ = nodeEnv !== 'production';
    } else {
        const hostname = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';
        const protocol = (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : '';
        const isLocalHost = /^(localhost|127\.0\.0\.1|::1)$/i.test(hostname);
        const isLocalSuffix = /\.local$/i.test(hostname);
        __DEV__ = protocol === 'file:' || isLocalHost || isLocalSuffix;
    }
    const log = (...args) => {
        if (__DEV__) {
            console.log(...args);
        }
    };
    const warn = (...args) => {
        if (__DEV__) {
            console.warn(...args);
        }
    };
    const error = (...args) => {
        console.error(...args);
    };

    log('Script successfully loaded and executed');

    // DOM Elements
    const sessionBanner = document.getElementById('sessionBanner');
    const sessionDetails = document.getElementById('sessionDetails');
    const sessionSummary = document.getElementById('sessionSummary');
    const sessionSummaryList = document.getElementById('sessionSummaryList');
    const sessionSummaryProduct = document.getElementById('sessionSummaryProduct');
    const sessionSummaryMethod = document.getElementById('sessionSummaryMethod');
    const sessionSummaryDose = document.getElementById('sessionSummaryDose');
    const sessionSummaryEmpty = document.getElementById('sessionSummaryEmpty');
    const editSessionDetailsBtn = document.getElementById('editSessionDetailsBtn');
    const sessionBtn = document.getElementById('sessionBtn');
    const sessionDetailsModal = document.getElementById('sessionDetailsModal');
    const sdmProductName = document.getElementById('sdmProductName');
    const sdmMethod = document.getElementById('sdmMethod');
    const sdmDose = document.getElementById('sdmDose');
    const sdmUnit = document.getElementById('sdmUnit');
    const sdmSaveBtn = document.getElementById('sdmSave');
    const sdmCancelBtn = document.getElementById('sdmCancel');
    const sdmAddDoseBtn = document.getElementById('sdmAddDose');
    const sdmHistoryBtn = document.getElementById('sdmHistory');
    const sdmShareBtn = document.getElementById('sdmShare');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const themeContainer = document.querySelector('.theme-container');
    const skinSelector = document.getElementById('skinSelector');
    const skinOptionsGroup = document.querySelector('.skin-options');
    const timerSkin = document.getElementById('timerSkin');
    const skinOptions = Array.from(document.querySelectorAll('.skin-option'));
    const themeToggle = document.getElementById('themeToggle');
    const logBtn = document.getElementById('logBtn');
    const logModal = document.getElementById('logModal');
    const logBackdrop = document.getElementById('logBackdrop');
    const momentForm = document.getElementById('moment-form');
    const momentEffectInput = document.getElementById('moment-effect');
    const momentCancelBtn = document.getElementById('moment-cancel');
    const logList = document.querySelector('.log-list');
    const logsSection = document.querySelector('.logs');
    const logLiveRegion = document.getElementById('log-live');
    const highIdeaBtn = document.getElementById('highIdeaBtn');
    const highIdeaBackdrop = document.getElementById('highIdeaBackdrop');
    const highIdeaModal = document.getElementById('highIdeaModal');
    const ideaForm = document.getElementById('idea-form');
    const ideaTextarea = document.getElementById('idea-text');
    const ideaCancelBtn = document.getElementById('idea-cancel');
    const ideaFormattingButtons = Array.from(document.querySelectorAll('.formatting-btn'));
    const entertainmentModal = document.getElementById('entertainmentModal');
    const dismissEntertainment = document.getElementById('dismissEntertainment');
    const distractMeBtn = document.getElementById('distractMeBtn');
    const shareModalBackdrop = document.getElementById('shareModalBackdrop');
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const shareMessage = document.getElementById('shareMessage');
    const sharePreview = document.getElementById('sharePreview');
    const simpleShareBtn = document.getElementById('simpleShareBtn');
    const detailedShareBtn = document.getElementById('detailedShareBtn');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareFacebook = document.getElementById('shareFacebook');
    const copyLink = document.getElementById('copyLink');
    const shareFeedback = document.getElementById('shareFeedback');
    const logsShareButton = document.getElementById('logsShareButton');
    const timerContainer = document.getElementById('timerContainer');
    const timerDisplay = document.getElementById('timer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    // Settings & history controls
    const settingsBtn = document.getElementById('settings-btn') || document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsBackdrop = document.getElementById('settingsBackdrop');
    const settingsForm = document.getElementById('settingsForm');
    const settingsCancelBtn = document.getElementById('settingsCancel');
    const settingsSaveBtn = document.getElementById('settingsSave');
    const closeSettingsModalBtn = document.getElementById('closeSettingsModal');
    const themeSelect = document.getElementById('settingsTheme');
    const pulseGlowToggle = document.getElementById('settingsPulseGlow');
    const enableBeepToggle = document.getElementById('settingsEnableBeep');
    const beepVolumeInput = document.getElementById('settingsBeepVolume');
    const beepVolumeValue = document.getElementById('settingsBeepVolumeValue');
    const autoStartToggle = document.getElementById('settingsAutoStart');
    const confirmResetToggle = document.getElementById('settingsConfirmReset');
    const reduceMotionToggle = document.getElementById('settingsReduceMotion');
    const historySizeInput = document.getElementById('historySizeSelect');
    const announceCadenceSelect = document.getElementById('announceCadence');
    const openHistoryButton = document.getElementById('openHistory');
    const accountBtn = document.getElementById('accountBtn');
    const settingsLiveRegion = document.getElementById('settingsStatus');
    const globalLiveRegion = document.getElementById('live');
    const updateBeepVolumeLabel = () => {
        if (!beepVolumeInput || !beepVolumeValue) {
            return;
        }
        const raw = parseFloat(beepVolumeInput.value);
        const percent = Number.isFinite(raw) ? Math.round(raw * 100) : Math.round((appSettings?.beepVolume ?? 0.6) * 100);
        beepVolumeValue.textContent = `${percent}%`;
    };
    const appAlerts = document.getElementById('appAlerts');
    const timerLive = document.getElementById('timer-status');
    const historyModal = document.getElementById('historyModal');
    const historyBackdrop = document.getElementById('historyBackdrop');
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const closeHistoryBtn = document.getElementById('closeHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');
    const historyHelp = document.getElementById('historyHelp');
    const appRoot = document.getElementById('app') || document.body;
    const appContent = document.querySelector('.app-content') || document.querySelector('main');
    const openModals = new Map();
    let modalRoot = null;

    const ensureModalRoot = () => {
        if (modalRoot && document.body.contains(modalRoot)) {
            return modalRoot;
        }
        modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            document.body.appendChild(modalRoot);
        }
        return modalRoot;
    };

    const mountModalElements = (modalNode, backdropNode) => {
        const root = ensureModalRoot();
        if (!root) {
            return false;
        }

        const safeAppend = (target, node) => {
            if (!node) {
                return true;
            }
            if (node.parentElement === target) {
                return true;
            }
            try {
                target.appendChild(node);
                return true;
            } catch (appendError) {
                warn('BuzzTimer: unable to mount modal node', appendError);
                return false;
            }
        };

        if (backdropNode && !safeAppend(root, backdropNode)) {
            return false;
        }

        if (modalNode) {
            const parent = modalNode.parentElement;
            if (!parent || (parent !== root && parent !== backdropNode)) {
                if (!safeAppend(root, modalNode)) {
                    return false;
                }
            }
        }

        return true;
    };

    ensureModalRoot();

    if (!__DEV__) {
        if (appRoot && appRoot.classList) {
            appRoot.classList.remove('debug', 'debug-grid', 'timer-outline');
        }
        if (timerContainer) {
            timerContainer.classList.remove('timer-outline', 'debug', 'debug-grid');
            const debugMarkers = timerContainer.querySelectorAll('[data-debug-overlay], .timer-outline-corner, .debug-corner');
            debugMarkers.forEach((node) => {
                if (typeof node.remove === 'function') {
                    node.remove();
                } else if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        }
    }

    if (settingsBtn && !settingsBtn.dataset.state) {
        settingsBtn.dataset.state = 'closed';
    }

// A mapping from the data-skin values to a display-friendly name
    let currentSkin = 'classic';

const themeNames = {
  classic: 'Classic',
  calm: 'Calm',
  retro: 'Retro',
  partyvibe: 'Party Vibe',
};
    // Grab the <p id="activeThemeText">
    const activeThemeText = document.getElementById('activeThemeText');
activeThemeText.textContent = `Active Theme: ${themeNames[currentSkin]}`;
    // 1) Tippy.js Initialization (new)
    tippy('[data-tippy-content]', {
        theme: 'buzz',
        animation: 'scale',
        duration: [200, 150],
        placement: 'top'
    });

    // Timer Variables
    let sessionDetailsSaved = false;
    let sessionDetailsTriggerEl = null;
    let resetConfirmPending = false;
    let resetConfirmTimeout;
    let currentElapsedMs = 0;
    let beepAudioContext = null;
    let lastCadenceMinute = -1;

    const LEGACY_SETTINGS_KEYS = Object.freeze({
        historyRetention: 'bt:retention',
        announceCadence: 'bt:announceCadence',
        theme: 'bt:lastTheme',
        startupTheme: 'bt:startupTheme',
    });

    const SettingsStore = window.SettingsStore;
    if (!SettingsStore) {
        throw new Error('BuzzTimer: SettingsStore module failed to load.');
    }

    const SETTINGS_STORAGE_KEY = SettingsStore.SETTINGS_STORAGE_KEY;
    const DEFAULT_APP_SETTINGS = SettingsStore.DEFAULT_SETTINGS;
    const migrateSettings = SettingsStore.migrateSettings;
    const loadSettingsFromStore = SettingsStore.loadSettings;
    const saveSettingsToStore = SettingsStore.saveSettings;

    const HISTORY_STORAGE_KEY = 'bt:sessions';

    const ANNOUNCEMENT_STEPS = Object.freeze({
        off: 0,
        '1m': 1,
        '5m': 5,
    });

    const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);

    const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    const safeStorageGet = (key) => {
        if (!canUseStorage()) {
            return null;
        }
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            warn('BuzzTimer: unable to read storage key', key, error);
            return null;
        }
    };

    const safeStorageSet = (key, value) => {
        if (!canUseStorage()) {
            return;
        }
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            warn('BuzzTimer: unable to persist storage key', key, error);
        }
    };

    const safeStorageRemove = (key) => {
        if (!canUseStorage()) {
            return;
        }
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            warn('BuzzTimer: unable to remove storage key', key, error);
        }
    };

    const safeStorageParse = (key) => {
        const raw = safeStorageGet(key);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            warn('BuzzTimer: unable to parse storage key', key, error);
            return null;
        }
    };

    const ACTIVE_SESSION_STORAGE_KEY = 'bt_session_active';
    const LAST_SESSION_STORAGE_KEY = 'bt_session_last';
    const THEME_STORAGE_KEY = 'bt_theme_current';

    const loadJson = (key) => safeStorageParse(key);
    const saveJson = (key, value) => {
        if (value === null || value === undefined) {
            safeStorageRemove(key);
            return;
        }
        try {
            safeStorageSet(key, JSON.stringify(value));
        } catch (storageError) {
            warn('BuzzTimer: unable to persist session key', key, storageError);
        }
    };

    const cloneSession = (value) => {
        if (!value) {
            return null;
        }
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (cloneError) {
            warn('BuzzTimer: unable to clone session object', cloneError);
            return null;
        }
    };

    let cachedActiveSession = loadJson(ACTIVE_SESSION_STORAGE_KEY);
    let cachedLastSession = loadJson(LAST_SESSION_STORAGE_KEY);

    const getActiveSession = () => cachedActiveSession || null;
    const setActiveSession = (session) => {
        cachedActiveSession = session ? cloneSession(session) : null;
        saveJson(ACTIVE_SESSION_STORAGE_KEY, cachedActiveSession);
    };

    const getLastSession = () => cachedLastSession || null;
    const setLastSession = (session) => {
        cachedLastSession = session ? cloneSession(session) : null;
        saveJson(LAST_SESSION_STORAGE_KEY, cachedLastSession);
    };

    const getCurrentTheme = () => safeStorageGet(THEME_STORAGE_KEY) || currentSkin || 'classic';
    const hasSessionBaseline = (session) => Boolean(session && session.productName && session.method);

    sessionDetailsSaved = sessionDetailsSaved || hasSessionBaseline(getActiveSession());

    const settingsStorageAdapter = {
        getItem: (key) => safeStorageGet(key),
        setItem: (key, value) => safeStorageSet(key, value),
        removeItem: (key) => safeStorageRemove(key),
    };

    const readLegacySettings = () => {
        const legacy = {};
        const retention = safeStorageGet(LEGACY_SETTINGS_KEYS.historyRetention);
        if (retention !== null) {
            legacy.historyRetention = retention;
        }
        const cadence = safeStorageGet(LEGACY_SETTINGS_KEYS.announceCadence);
        if (cadence !== null) {
            legacy.announceCadence = cadence;
        }
        const storedTheme = safeStorageGet(LEGACY_SETTINGS_KEYS.theme);
        if (storedTheme) {
            legacy.theme = storedTheme;
        }
        return legacy;
    };

    let appSettings = loadSettingsFromStore(settingsStorageAdapter, {
        legacyLoader: readLegacySettings,
        onMigrate: () => {
            Object.values(LEGACY_SETTINGS_KEYS).forEach((key) => safeStorageRemove(key));
        },
    });

    if (!appSettings || typeof appSettings !== 'object') {
        appSettings = { ...DEFAULT_APP_SETTINGS };
    }

    saveSettingsToStore(appSettings, settingsStorageAdapter);

    let historyRetention = appSettings.historyRetention;
    let announcementCadence = appSettings.announceCadence;

    const reduceMotionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const shouldReduceMotion = () => {
        if (!appSettings || appSettings.reduceMotionRespect === false) {
            return false;
        }
        return reduceMotionQuery ? reduceMotionQuery.matches : false;
    };

    const syncReduceMotionClass = () => {
        if (!document.body) {
            return;
        }
        document.body.classList.toggle('reduce-motion-override', appSettings && appSettings.reduceMotionRespect === false);
    };



    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    const fmtDate = (timestamp) => {
        try {
            const date = new Date(typeof timestamp === 'number' ? timestamp : Number(timestamp));
            if (Number.isNaN(date.getTime())) {
                return 'Unknown date';
            }
            return date.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        } catch (error) {
            warn('BuzzTimer: unable to format date', timestamp, error);
            return 'Unknown date';
        }
    };

    const fmtDur = (ms) => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return [
                String(hours).padStart(2, '0'),
                String(minutes).padStart(2, '0'),
                String(seconds).padStart(2, '0'),
            ].join(':');
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    const sanitizeHtml = (html) => {
        if (!html || typeof html !== 'string') {
            return '';
        }
        const template = document.createElement('template');
        template.innerHTML = html;
        const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'UL', 'OL', 'LI', 'P', 'A']);

        const cleanNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                node.remove();
                return;
            }
            if (!allowedTags.has(node.tagName)) {
                const parent = node.parentNode;
                if (parent) {
                    while (node.firstChild) {
                        parent.insertBefore(node.firstChild, node);
                    }
                    parent.removeChild(node);
                } else {
                    node.remove();
                }
                return;
            }
            Array.from(node.attributes).forEach((attr) => {
                if (node.tagName === 'A' && attr.name.toLowerCase() === 'href') {
                    try {
                        const url = new URL(node.getAttribute(attr.name), window.location.origin);
                        if (!['http:', 'https:'].includes(url.protocol)) {
                            node.removeAttribute(attr.name);
                        } else {
                            node.setAttribute('target', '_blank');
                            node.setAttribute('rel', 'noopener noreferrer');
                        }
                    } catch (error) {
                        node.removeAttribute(attr.name);
                    }
                } else {
                    node.removeAttribute(attr.name);
                }
            });
            Array.from(node.childNodes).forEach(cleanNode);
        };

        Array.from(template.content.childNodes).forEach(cleanNode);
        return template.innerHTML;
    };

    const toPlainText = (html) => {
        if (!html) {
            return '';
        }
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.textContent?.trim() || '';
    };

    let sessionStartTimestamp = null;
    let sessionEffects = [];
    let sessionHighIdeas = [];
    let historyOpener = null;
    let applyThemeFromHistory = null;

    const getElapsedSeconds = () => Math.floor(currentElapsedMs / 1000);

    const listSessions = () => {
        const stored = safeStorageParse(HISTORY_STORAGE_KEY);
        if (!Array.isArray(stored)) {
            return [];
        }
        return stored.filter((entry) => entry && typeof entry === 'object');
    };

    const persistSessions = (sessions) => {
        try {
            safeStorageSet(HISTORY_STORAGE_KEY, JSON.stringify(sessions));
        } catch (error) {
            warn('BuzzTimer: unable to persist sessions', error);
        }
    };

    const getRetention = () => historyRetention;

    const saveSession = (session) => {
        const retention = getRetention();
        if (retention <= 0) {
            return;
        }
        const existing = listSessions();
        const next = [session, ...existing].slice(0, retention);
        persistSessions(next);
    };

    const removeSessionById = (id) => {
        const existing = listSessions();
        const filtered = existing.filter((entry) => entry.id !== id);
        persistSessions(filtered);
    };

    const resetSessionCapture = () => {
        sessionStartTimestamp = null;
        sessionEffects = [];
        sessionHighIdeas = [];
    };

    const describeDurationForAria = (ms = 0) => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const parts = [];
        if (hours > 0) {
            parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
        }
        if (parts.length === 0) {
            parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
        }
        return parts.join(' ');
    };

    const buildHistoryAriaLabel = (session) => {
        if (!session) {
            return '';
        }
        const parts = [];
        if (session.startedAt) {
            parts.push(fmtDate(session.startedAt));
        }
        parts.push(describeDurationForAria(session.elapsedMs || 0));
        if (session.theme) {
            const friendlyTheme = themeNames[session.theme] || session.theme;
            parts.push(`${friendlyTheme} theme`);
        }
        if (session.productName) {
            parts.push(`strain ${session.productName}`);
        }
        const doseParts = [];
        if (Number.isFinite(session.doseAmount)) {
            doseParts.push(String(session.doseAmount));
        }
        if (session.doseUnit) {
            doseParts.push(session.doseUnit);
        }
        if (doseParts.length > 0) {
            parts.push(doseParts.join(' '));
        }
        return parts.join(', ');
    };

    const exportSessionsToFile = (sessions, filename = 'buzz-timer-history.json') => {
        try {
            const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 0);
        } catch (error) {
            warn('BuzzTimer: unable to export sessions', error);
            showAppAlert('Unable to export history right now.');
        }
    };

    const exportSingleSession = (session) => {
        if (!session) {
            return;
        }
        const safeId = typeof session.id === 'string' ? session.id : Date.now();
        exportSessionsToFile([session], `buzz-timer-session-${safeId}.json`);
    };

    const updateTimerDisplay = () => {
        if (!timerDisplay) {
            return;
        }
        timerDisplay.textContent = formatTime(getElapsedSeconds());
    };

    const announceTimerStatus = (message) => {
        if (!timerLive) {
            return;
        }
        const updater = () => {
            timerLive.textContent = message;
        };
        timerLive.textContent = '';
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(updater);
        } else {
            setTimeout(updater, 0);
        }
    };

    const getFormattedElapsedTime = () => {
        const elapsedMs = Math.max(0, timer.getElapsedMs());
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        return formatTime(elapsedSeconds);
    };

    const hideElement = (element) => {
        element.classList.add('hidden');
    };

    const showElement = (element) => {
        element.classList.remove('hidden');
    };

    const announce = (message, { target } = {}) => {
        const region = target || globalLiveRegion || settingsLiveRegion;
        if (!region) {
            return;
        }
        region.textContent = '';
        if (!message) {
            return;
        }
        const update = () => {
            region.textContent = message;
        };
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(update);
        } else {
            setTimeout(update, 0);
        }
    };

    const syncAppModalState = () => {
        if (!appRoot) {
            return;
        }

        const settingsToggle = document.getElementById('settings-btn') || settingsBtn;

        if (openModals.size > 0) {
            document.body.style.overflow = 'hidden';
            appRoot.classList.add('modal-open');
            if (appContent) {
                appContent.setAttribute('aria-hidden', 'true');
                appContent.setAttribute('inert', '');
            }
        } else {
            document.body.style.overflow = '';
            appRoot.classList.remove('modal-open');
            if (appContent) {
                appContent.removeAttribute('aria-hidden');
                appContent.removeAttribute('inert');
            }
            if (settingsToggle) {
                settingsToggle.setAttribute('aria-expanded', 'false');
                if (settingsToggle.dataset) {
                    settingsToggle.dataset.state = 'closed';
                }
            }
        }
    };

    const showAppAlert = (message) => {
        if (!appAlerts) return;
        appAlerts.classList.add('is-visible');
        appAlerts.textContent = message;
    };

    const clearAppAlert = () => {
        if (!appAlerts) return;
        appAlerts.textContent = '';
        appAlerts.classList.remove('is-visible');
    };

    const showShareFeedback = (message) => {
        if (!shareFeedback) return;
        shareFeedback.classList.add('is-visible');
        shareFeedback.textContent = message;
    };

    const clearShareFeedback = () => {
        if (!shareFeedback) return;
        shareFeedback.textContent = '';
        shareFeedback.classList.remove('is-visible');
    };

    const ensureLogsVisible = () => {
        if (logsSection) {
            showElement(logsSection);
        }
    };

    const hideLogsIfEmpty = () => {
        if (logsSection && logList && logList.children.length === 0) {
            hideElement(logsSection);
        }
    };

    const toISODuration = (totalSeconds) => {
        const seconds = Math.max(0, Math.floor(totalSeconds));
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        let iso = 'PT';
        if (hours) iso += `${hours}H`;
        if (minutes) iso += `${minutes}M`;
        if (secs || (!hours && !minutes)) iso += `${secs}S`;
        return iso;
    };

    const onEditLog = (listItem) => {
        warn('BuzzTimer: edit log action not yet implemented.', listItem);
    };

    const onDeleteLog = (listItem) => {
        if (!listItem) return;
        const list = listItem.parentElement;
        listItem.remove();
        if (list === logList) {
            hideLogsIfEmpty();
        }
        const timeNode = listItem.querySelector('.log-time');
        const badgeNode = listItem.querySelector('.log-badge');
        if (logLiveRegion && timeNode && badgeNode) {
            logLiveRegion.textContent = `Removed ${badgeNode.textContent.toLowerCase()} at ${timeNode.textContent}.`;
        }
    };

    const renderLogItem = ({ type, timeText, timeISO, text }) => {
        const li = document.createElement('li');
        li.dataset.type = type;

        const timeEl = document.createElement('time');
        timeEl.className = 'log-time';
        timeEl.dateTime = timeISO;
        timeEl.textContent = timeText;

        const badge = document.createElement('span');
        badge.className = 'log-badge';
        badge.dataset.type = type;
        badge.textContent = type === 'idea' ? 'Idea' : 'Moment';

        const textSpan = document.createElement('span');
        textSpan.className = 'log-text';
        textSpan.textContent = text;

        const actions = document.createElement('span');
        actions.className = 'log-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('aria-label', `Edit ${type} at ${timeText}`);
        editBtn.addEventListener('click', () => onEditLog(li));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', `Delete ${type} at ${timeText}`);
        deleteBtn.addEventListener('click', () => onDeleteLog(li));

        actions.append(editBtn, deleteBtn);
        li.append(timeEl, badge, textSpan, actions);
        return li;
    };

    const addLogEntry = (entry) => {
        if (!logList) return;
        const item = renderLogItem(entry);
        logList.insertBefore(item, logList.firstChild);
        ensureLogsVisible();
        if (logLiveRegion) {
            const label = entry.type === 'idea' ? 'idea' : 'moment';
            logLiveRegion.textContent = `Added ${label} at ${entry.timeText}: ${entry.text}`;
        }
    };

    const clampVolume = (value) => clampNumber(Number.isFinite(value) ? value : appSettings.beepVolume, 0, 1);

    const ensureAudioContext = () => {
        if (typeof window === 'undefined') {
            return null;
        }
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return null;
        }
        if (!beepAudioContext) {
            try {
                beepAudioContext = new AudioCtx();
            } catch (error) {
                warn('BuzzTimer: unable to initialise audio context', error);
                beepAudioContext = null;
            }
        }
        return beepAudioContext;
    };

    const playBeep = () => {
        if (!appSettings || !appSettings.enableBeep) {
            return;
        }
        const ctx = ensureAudioContext();
        if (!ctx) {
            return;
        }
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.value = 660;
            gainNode.gain.value = clampVolume(appSettings.beepVolume) * 0.3;
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            const now = ctx.currentTime;
            oscillator.start(now);
            oscillator.stop(now + 0.18);
        } catch (error) {
            warn('BuzzTimer: unable to play beep', error);
        }
    };

    const triggerHaptics = () => {
        if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
            return;
        }
        try {
            navigator.vibrate(60);
        } catch (error) {
            warn('BuzzTimer: unable to trigger vibration', error);
        }
    };

    const notifyCadenceTick = (minutes) => {
        if (!appSettings || !appSettings.enableBeep) {
            return;
        }
        playBeep();
        triggerHaptics();
        log(`Cadence notification fired at minute ${minutes}`);
    };

    const maybeFireCadenceTick = () => {
        const cadenceStep = ANNOUNCEMENT_STEPS[announcementCadence] ?? 0;
        const minutes = Math.max(0, Math.floor(currentElapsedMs / 60000));
        if (minutes === lastCadenceMinute) {
            return;
        }
        if (cadenceStep > 0 && minutes > 0 && minutes % cadenceStep === 0) {
            notifyCadenceTick(minutes);
        }
        lastCadenceMinute = minutes;
    };

    const handleTimerTick = (elapsedMs) => {
        currentElapsedMs = Math.max(0, elapsedMs);
        updateTimerDisplay();
        maybeFireCadenceTick();
    };

    const TimerCtor = window.TimerEngine || globalThis.TimerEngine;
    if (!TimerCtor) {
        throw new Error('TimerEngine module failed to load.');
    }
    const timer = new TimerCtor(
        { onTick: handleTimerTick },
        { hiddenInterval: 400 }
    );

    const TIMER_STORAGE_KEY = 'buzzTimer.state';

    const persistTimerState = (overrides = {}) => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            const isRunning = timer.isRunning();
            const baseState = {
                isRunning,
                accumulatedMs: Math.max(0, timer.getElapsedMs()),
                startWallClock: isRunning ? Date.now() : null,
            };
            const stateToPersist = { ...baseState, ...overrides };
            window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(stateToPersist));
        } catch (error) {
            warn('BuzzTimer: unable to persist timer state', error);
        }
    };

    const restoreTimerState = () => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }
        try {
            const raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
            if (!raw) {
                return false;
            }
            const stored = JSON.parse(raw);
            if (!stored || typeof stored !== 'object') {
                return false;
            }
            let accumulatedMs = Number(stored.accumulatedMs);
            if (!Number.isFinite(accumulatedMs) || accumulatedMs < 0) {
                accumulatedMs = 0;
            }
            const wasRunning = stored.isRunning === true;
            const startWallClock = typeof stored.startWallClock === 'number' ? stored.startWallClock : null;
            if (wasRunning && startWallClock) {
                const delta = Date.now() - startWallClock;
                if (delta > 0) {
                    accumulatedMs += delta;
                }
            }
            lastCadenceMinute = -1;
            timer.setState({
                accumulatedMs,
                isRunning: wasRunning,
            });
            persistTimerState();
            return true;
        } catch (error) {
            warn('BuzzTimer: unable to restore timer state', error);
            return false;
        }
    };

    const syncTimerDisplay = () => {
        handleTimerTick(timer.getElapsedMs());
    };

    const handleVisibilitySync = () => {
        timer.handleVisibilityChange();
        syncTimerDisplay();
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
            persistTimerState();
        }
    };

    const handleWindowBlur = () => {
        syncTimerDisplay();
        persistTimerState();
    };

    const handleWindowFocus = () => {
        timer.handleVisibilityChange();
        syncTimerDisplay();
    };

    const setStartButtonState = (state) => {
        startBtn.dataset.state = state;
        const label = state === 'pause' ? 'Pause' : 'Start';
        startBtn.setAttribute('aria-label', label);
    };

    const setTimerRunningVisual = (isRunning) => {
        if (!timerContainer) {
            return;
        }
        const shouldGlow = Boolean(isRunning && appSettings && appSettings.enablePulseGlow);
        timerContainer.classList.toggle('timer-container--running', shouldGlow);
    };

    const startTimer = () => {
        if (timer.isRunning()) {
            return;
        }
        timer.start();
        setStartButtonState('pause');
        setTimerRunningVisual(true);
        persistTimerState();
        lastCadenceMinute = Math.max(0, Math.floor(timer.getElapsedMs() / 60000));
        announceTimerStatus(`Timer started (${getFormattedElapsedTime()})`);
        log('Timer started');
    };

    const pauseTimer = () => {
        if (!timer.isRunning()) {
            return;
        }
        timer.pause();
        setStartButtonState('start');
        setTimerRunningVisual(false);
        persistTimerState({ startWallClock: null });
        announceTimerStatus(`Timer paused at ${getFormattedElapsedTime()}`);
        log('Timer paused');
    };

    const formatDoseSummary = (details) => {
        if (!details) {
            return 'Not specified';
        }
        const sourceDose = details.dose && typeof details.dose === 'object' ? details.dose : null;
        const amount = sourceDose?.amount ?? details.doseAmount;
        const unit = sourceDose?.unit || details.doseUnit || 'mg';
        if (amount === null || amount === undefined || amount === '') {
            return unit;
        }
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        const displayAmount = Number.isFinite(numericAmount) ? numericAmount : amount;
        return `${displayAmount}${unit ? ` ${unit}` : ''}`.trim();
    };

    const updateSessionSummary = (details) => {
        if (!sessionDetails || !sessionSummary) {
            return;
        }
        const hasDetails = hasSessionBaseline(details);
        if (hasDetails) {
            if (sessionSummaryProduct) {
                sessionSummaryProduct.textContent = details.productName;
            }
            if (sessionSummaryMethod) {
                sessionSummaryMethod.textContent = details.method;
            }
            if (sessionSummaryDose) {
                sessionSummaryDose.textContent = formatDoseSummary(details);
            }
            if (sessionSummaryList) {
                sessionSummaryList.classList.remove('hidden');
            }
            if (sessionSummaryEmpty) {
                sessionSummaryEmpty.classList.add('hidden');
            }
            showElement(sessionDetails);
            if (editSessionDetailsBtn) {
                editSessionDetailsBtn.classList.remove('hidden');
            }
        } else {
            if (sessionSummaryList) {
                sessionSummaryList.classList.add('hidden');
            }
            if (sessionSummaryEmpty) {
                sessionSummaryEmpty.classList.remove('hidden');
            }
            hideElement(sessionDetails);
            if (editSessionDetailsBtn) {
                editSessionDetailsBtn.classList.add('hidden');
            }
        }
    };

    const attachBannerTrigger = () => {
        if (!sessionBanner) {
            return;
        }
        const trigger = sessionBanner.querySelector('[data-session-trigger]');
        if (trigger) {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                openSessionDetailsModal(event.currentTarget);
            });
        }
    };

    const renderSessionBanner = (hasDetails, { animate = false } = {}) => {
        if (!sessionBanner) {
            return;
        }
        if (hasDetails) {
            sessionBanner.innerHTML = `
                <div class="save-confirm" role="status" aria-live="polite">
                    <span>Session details saved!</span>
                    <button id="expandSessionBtn2" type="button" class="btn secondary" data-session-trigger>
                        Edit Details
                    </button>
                </div>`;
        } else {
            sessionBanner.innerHTML = `
                <p>
                    Want to add more details to your session?
                    <button id="expandSessionBtn" type="button" data-session-trigger data-tippy-content="Expand to enter session details.">
                        Expand
                    </button>
                </p>`;
        }
        showElement(sessionBanner);
        attachBannerTrigger();

        if (hasDetails) {
            const saveConfirmEl = sessionBanner.querySelector('.save-confirm');
            if (saveConfirmEl && animate && !shouldReduceMotion()) {
                saveConfirmEl.classList.add('save-confirm--enter');
                const activateAnimation = () => {
                    saveConfirmEl.classList.add('save-confirm--enter-active');
                };
                if (typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(activateAnimation);
                } else {
                    activateAnimation();
                }
                saveConfirmEl.addEventListener('transitionend', () => {
                    saveConfirmEl.classList.remove('save-confirm--enter');
                    saveConfirmEl.classList.remove('save-confirm--enter-active');
                }, { once: true });
            }
        }
    };

    const syncSessionDetailsUI = ({ animateBanner = false } = {}) => {
        updateSessionSummary(getActiveSession());
        renderSessionBanner(sessionDetailsSaved, { animate: animateBanner && sessionDetailsSaved });
    };

    const prefillSessionDetailsFields = () => {
        const source = getActiveSession() || getLastSession();
        const sourceDose = source && typeof source.dose === 'object' ? source.dose : null;
        if (sdmProductName) {
            sdmProductName.value = source?.productName || '';
        }
        if (sdmMethod) {
            sdmMethod.value = source?.method || '';
        }
        if (sdmDose) {
            const doseAmount = sourceDose?.amount ?? source?.doseAmount;
            const normalizedAmount = typeof doseAmount === 'string' ? parseFloat(doseAmount) : doseAmount;
            sdmDose.value = Number.isFinite(normalizedAmount) ? String(normalizedAmount) : '';
        }
        if (sdmUnit) {
            sdmUnit.value = sourceDose?.unit || source?.doseUnit || 'mg';
        }
    };

    const openSessionDetailsModal = (triggerEl) => {
        if (!sessionDetailsModal) {
            return;
        }
        sessionDetailsTriggerEl = triggerEl || document.activeElement || null;
        prefillSessionDetailsFields();
        openModal('sessionDetails', sessionDetailsTriggerEl);
        log('Session details modal opened');
    };

    const closeSessionDetailsModal = () => {
        closeModal('sessionDetails');
        sessionDetailsTriggerEl = null;
        log('Session details modal closed');
    };

    const expandSessionDetails = (event) => {
        const trigger = event?.currentTarget || event || sessionBtn || startBtn;
        openSessionDetailsModal(trigger);
    };

    const announceSessionValidation = (message, focusTarget) => {
        showAppAlert(message);
        if (focusTarget && typeof focusTarget.focus === 'function') {
            try {
                focusTarget.focus({ preventScroll: true });
            } catch (focusError) {
                focusTarget.focus();
            }
        }
    };

    const handleSessionDetailsSave = () => {
        if (!sdmProductName || !sdmMethod) {
            return;
        }
        const productName = sdmProductName.value.trim();
        const method = sdmMethod.value.trim();
        const rawDose = sdmDose ? sdmDose.value.trim() : '';
        const hasDoseValue = rawDose.length > 0;
        const doseAmount = hasDoseValue ? parseFloat(rawDose) : null;
        const doseUnit = sdmUnit && sdmUnit.value ? sdmUnit.value : 'mg';

        if (!productName) {
            announceSessionValidation('Please enter a product name.', sdmProductName);
            return;
        }
        if (!method) {
            announceSessionValidation('Please select a consumption method.', sdmMethod);
            return;
        }
        if (hasDoseValue && (!Number.isFinite(doseAmount) || doseAmount < 0)) {
            announceSessionValidation('Dose must be zero or higher.', sdmDose);
            return;
        }

        const nowIso = new Date().toISOString();
        const existing = getActiveSession() || {};
        const active = {
            ...existing,
            productName,
            method,
            dose: {
                amount: hasDoseValue ? doseAmount : null,
                unit: doseUnit,
            },
            theme: existing.theme || getCurrentTheme(),
        };
        active.doseAmount = hasDoseValue ? doseAmount : null;
        active.doseUnit = doseUnit;

        if (!active.startTime) {
            active.startTime = nowIso;
            active.elapsedSeconds = 0;
        }
        active.updatedAt = nowIso;

        setActiveSession(active);
        setLastSession(active);
        sessionDetailsSaved = true;
        syncSessionDetailsUI({ animateBanner: true });
        clearAppAlert();
        closeSessionDetailsModal();
        log('Session details saved');

        if (appSettings.autoStart && !timer.isRunning()) {
            startTimer();
        }
    };

    const clearSessionDetailsState = () => {
        const previousActive = getActiveSession();
        if (previousActive) {
            setLastSession(previousActive);
        }
        setActiveSession(null);
        sessionDetailsSaved = false;
        syncSessionDetailsUI();
    };

    syncSessionDetailsUI();

    if (sdmSaveBtn) {
        sdmSaveBtn.addEventListener('click', handleSessionDetailsSave);
    }

    if (sdmCancelBtn) {
        sdmCancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeSessionDetailsModal();
        });
    }

    if (sessionBtn) {
        sessionBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openSessionDetailsModal(event.currentTarget);
        });
    }

    if (editSessionDetailsBtn) {
        editSessionDetailsBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openSessionDetailsModal(event.currentTarget);
        });
    }

    startBtn.addEventListener('click', (event) => {
        if (!sessionDetailsSaved) {
            event.preventDefault();
            showAppAlert('Save your session details to start the timer.');
            expandSessionDetails(event);
            return;
        }

        if (!timer.isRunning()) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (appSettings.confirmReset) {
            if (!resetConfirmPending) {
                resetConfirmPending = true;
                showAppAlert('Press Reset again within 5 seconds to confirm.');
                if (resetConfirmTimeout) {
                    clearTimeout(resetConfirmTimeout);
                }
                resetConfirmTimeout = setTimeout(() => {
                    resetConfirmPending = false;
                    clearAppAlert();
                }, 5000);
                return;
            }
        } else {
            resetConfirmPending = false;
            if (resetConfirmTimeout) {
                clearTimeout(resetConfirmTimeout);
                resetConfirmTimeout = null;
            }
        }

        resetConfirmPending = false;
        if (resetConfirmTimeout) {
            clearTimeout(resetConfirmTimeout);
            resetConfirmTimeout = null;
        }

        lastCadenceMinute = -1;
        timer.reset();
        setStartButtonState('start');
        setTimerRunningVisual(false);
        persistTimerState({ isRunning: false, startWallClock: null, accumulatedMs: 0 });
        announceTimerStatus('Timer reset');
        log('Timer reset');

        clearSessionDetailsState();

        if (logList) {
            logList.innerHTML = '';
        }
        hideLogsIfEmpty();
        log("Log list cleared");

        closeModal('log');
        closeModal('highIdea');
        closeModal('share');
        closeModal('entertainment');

        timerContainer.focus();
        showAppAlert('Session reset. Timer 0 minutes.');
    });

    themeToggle.addEventListener('click', () => {
        const isHidden = skinSelector.classList.contains('hidden');
        if (isHidden) {
            showElement(skinSelector);
            skinSelector.setAttribute('aria-hidden', 'false');
            const activeIndex = skinOptions.findIndex(btn => btn.classList.contains('active'));
            focusSkinOption(activeIndex >= 0 ? activeIndex : 0);
            themeToggle.setAttribute('aria-expanded', 'true');
        } else {
            hideElement(skinSelector);
            skinSelector.setAttribute('aria-hidden', 'true');
            themeToggle.setAttribute('aria-expanded', 'false');
            timerContainer.focus();
        }
        log('Theme selector toggled');
    });


    const modalConfig = {
        settings: {
            modal: settingsMenu,
            backdrop: settingsBackdrop,
            focusFirst: () => {
                if (settingsMenu) {
                    const heading = settingsMenu.querySelector('#settingsTitle');
                    if (heading && typeof heading.focus === 'function') {
                        try {
                            heading.focus({ preventScroll: true });
                        } catch (error) {
                            heading.focus();
                        }
                        return;
                    }
                    if (typeof settingsMenu.focus === 'function') {
                        try {
                            settingsMenu.focus({ preventScroll: true });
                        } catch (error) {
                            settingsMenu.focus();
                        }
                        return;
                    }
                }
                if (themeSelect && typeof themeSelect.focus === 'function') {
                    try {
                        themeSelect.focus({ preventScroll: true });
                    } catch (error) {
                        themeSelect.focus();
                    }
                }
            },
            onOpen: () => {
                syncSettingsForm();
                if (settingsBtn) {
                    settingsBtn.setAttribute('aria-expanded', 'true');
                    settingsBtn.dataset.state = 'open';
                }
                announce('', { target: settingsLiveRegion });
            },
            onClose: () => {
                if (settingsBtn) {
                    settingsBtn.setAttribute('aria-expanded', 'false');
                    settingsBtn.dataset.state = 'closed';
                }
            },
            closeOnBackdrop: true,
        },
        sessionDetails: {
            modal: sessionDetailsModal,
            focusFirst: () => {
                if (sdmProductName && typeof sdmProductName.focus === 'function') {
                    try {
                        sdmProductName.focus({ preventScroll: true });
                    } catch (focusError) {
                        sdmProductName.focus();
                    }
                }
            },
            onOpen: () => prefillSessionDetailsFields(),
            onClose: () => {
                sessionDetailsTriggerEl = null;
                clearAppAlert();
            },
            closeOnBackdrop: true,
        },
        log: {
            modal: logModal,
            backdrop: logBackdrop,
            focusFirst: () => {
                const momentTitle = document.getElementById('moment-title');
                if (momentTitle && typeof momentTitle.focus === 'function') {
                    try {
                        momentTitle.focus({ preventScroll: true });
                    } catch (error) {
                        momentTitle.focus();
                    }
                } else if (momentEffectInput && typeof momentEffectInput.focus === 'function') {
                    momentEffectInput.focus();
                }
            },
            closeOnBackdrop: true,
        },
        highIdea: {
            modal: highIdeaModal,
            backdrop: highIdeaBackdrop,
            focusFirst: () => {
                const ideaTitle = document.getElementById('idea-title');
                if (ideaTitle && typeof ideaTitle.focus === 'function') {
                    try {
                        ideaTitle.focus({ preventScroll: true });
                    } catch (error) {
                        ideaTitle.focus();
                    }
                } else if (ideaTextarea && typeof ideaTextarea.focus === 'function') {
                    ideaTextarea.focus();
                }
            },
            closeOnBackdrop: true,
        },
        entertainment: {
            modal: entertainmentModal,
            focusFirst: () => {
                const closeBtn = entertainmentModal.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.focus();
                } else {
                    entertainmentModal.focus();
                }
            },
            closeOnBackdrop: true,
        },
        share: {
            modal: shareModal,
            backdrop: shareModalBackdrop,
            focusFirst: () => copyLink.focus(),
            onOpen: () => clearShareFeedback(),
            onClose: () => clearShareFeedback(),
        },
    };

    const trapFocus = (modal, event) => {
        const focusableSelectors = [
            'button', '[href]', 'input', 'select', 'textarea',
            '[tabindex]:not([tabindex="-1"])'
        ];
        const focusable = Array.from(modal.querySelectorAll(focusableSelectors.join(',')))
            .filter(el => !el.hasAttribute('disabled') && !el.classList.contains('hidden'));
        if (focusable.length === 0) {
            event.preventDefault();
            modal.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const openModal = (key, opener) => {
        const config = modalConfig[key];
        if (!config) return;
        const { modal, backdrop, focusFirst, onOpen } = config;
        if (!modal) {
            return;
        }

        const mounted = mountModalElements(modal, backdrop);
        if (!mounted) {
            if (backdrop) {
                hideElement(backdrop);
                backdrop.classList.add('hidden');
                backdrop.setAttribute('aria-hidden', 'true');
            }
            hideElement(modal);
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            openModals.delete(modal);
            syncAppModalState();
            error('BuzzTimer: failed to open modal due to mount failure', key);
            return;
        }

        if (backdrop) {
            showElement(backdrop);
            backdrop.classList.remove('hidden');
            backdrop.setAttribute('aria-hidden', 'false');
        }
        showElement(modal);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        openModals.set(modal, opener || document.activeElement);
        syncAppModalState();
        if (typeof onOpen === 'function') {
            onOpen();
        }
        setTimeout(() => {
            if (typeof focusFirst === 'function') {
                focusFirst();
            } else if (modal && typeof modal.focus === 'function') {
                try {
                    modal.focus({ preventScroll: true });
                } catch (focusError) {
                    modal.focus();
                }
            }
        }, 0);
    };

    const closeModal = (key) => {
        const config = modalConfig[key];
        if (!config) return;
        const { modal, backdrop, onClose } = config;
        hideElement(modal);
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        if (backdrop) {
            hideElement(backdrop);
            backdrop.classList.add('hidden');
            backdrop.setAttribute('aria-hidden', 'true');
        }
        if (typeof onClose === 'function') {
            onClose();
        }
        const opener = openModals.get(modal);
        openModals.delete(modal);
        syncAppModalState();
        if (opener && typeof opener.focus === 'function') {
            opener.focus();
        }
    };

    Object.entries(modalConfig).forEach(([key, config]) => {
        const { modal, backdrop, closeOnBackdrop } = config;
        if (!modal) return;

        modal.setAttribute('tabindex', '-1');

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            if (key === 'settings') {
                closeBtn.addEventListener('click', () => closeSettings('Settings closed.'));
            } else {
                closeBtn.addEventListener('click', () => closeModal(key));
            }
        }

        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                trapFocus(modal, event);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                if (key === 'settings') {
                    closeSettings('Settings closed.');
                } else {
                    closeModal(key);
                }
            }
        });

        if (closeOnBackdrop) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    if (key === 'settings') {
                        closeSettings('Settings closed.');
                    } else {
                        closeModal(key);
                    }
                }
            });
        }

        if (backdrop) {
            backdrop.setAttribute('aria-hidden', 'true');
            backdrop.addEventListener('click', (event) => {
                if (event.target === backdrop) {
                    if (key === 'settings') {
                        closeSettings('Settings closed.');
                    } else {
                        closeModal(key);
                    }
                }
            });
        }
    });

    const focusSkinOption = (index) => {
        skinOptions.forEach((btn, idx) => {
            btn.tabIndex = idx === index ? 0 : -1;
        });
        skinOptions[index].focus();
    };

    const selectSkinOption = (option) => {
        const optionId = option.id || `skin-option-${option.getAttribute('data-skin')}`;
        option.id = optionId;
        skinOptions.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-checked', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-checked', 'true');
        const selectedSkin = option.getAttribute('data-skin');
        log(`Selected skin: ${selectedSkin}`);

        const themes = ['theme-classic', 'theme-calm', 'theme-retro', 'theme-party'];
        themes.forEach(theme => themeContainer.classList.remove(theme));

        if (selectedSkin === 'calm') {
            themeContainer.classList.add('theme-calm');
        } else if (selectedSkin === 'retro') {
            themeContainer.classList.add('theme-retro');
        } else if (selectedSkin === 'partyvibe') {
            themeContainer.classList.add('theme-party');
        } else {
            themeContainer.classList.add('theme-classic');
        }

        timerSkin.src = `static/skins/${selectedSkin}.svg`;

        // Set the text in the p element
        currentSkin = selectedSkin;
        const friendlyName = themeNames[currentSkin] || 'Unknown';
        activeThemeText.textContent = `Active Theme: ${friendlyName}`;

        if (skinOptionsGroup) {
            skinOptionsGroup.setAttribute('aria-activedescendant', option.id);
        }

        return selectedSkin;
    };

    const syncSettingsForm = () => {
        if (!settingsForm) {
            return;
        }
        if (themeSelect) {
            themeSelect.value = appSettings.theme || DEFAULT_APP_SETTINGS.theme;
        }
        if (pulseGlowToggle) {
            pulseGlowToggle.checked = Boolean(appSettings.enablePulseGlow);
        }
        if (enableBeepToggle) {
            enableBeepToggle.checked = Boolean(appSettings.enableBeep);
        }
        if (beepVolumeInput) {
            beepVolumeInput.value = String(clampVolume(appSettings.beepVolume));
        }
        updateBeepVolumeLabel();
        if (autoStartToggle) {
            autoStartToggle.checked = Boolean(appSettings.autoStart);
        }
        if (confirmResetToggle) {
            confirmResetToggle.checked = Boolean(appSettings.confirmReset);
        }
        if (reduceMotionToggle) {
            reduceMotionToggle.checked = Boolean(appSettings.reduceMotionRespect);
        }
        if (historySizeInput) {
            historySizeInput.value = String(appSettings.historyRetention);
        }
        if (announceCadenceSelect) {
            announceCadenceSelect.value = appSettings.announceCadence;
        }
    };

    const applySettings = (settings, options = {}) => {
        historyRetention = settings.historyRetention;
        announcementCadence = settings.announceCadence;
        syncReduceMotionClass();

        if (!options.skipTheme) {
            const desiredTheme = settings.theme || DEFAULT_APP_SETTINGS.theme;
            const matching = skinOptions.find(btn => btn.getAttribute('data-skin') === desiredTheme);
            if (matching) {
                selectSkinOption(matching);
            } else if (skinOptions.length > 0) {
                selectSkinOption(skinOptions[0]);
            }
        }

        if (!options.skipFormSync) {
            syncSettingsForm();
        } else {
            updateBeepVolumeLabel();
        }

        setTimerRunningVisual(timer.isRunning());
    };

    const commitSettings = (patch = {}, options = {}) => {
        const merged = { ...appSettings, ...patch };
        const nextSettings = migrateSettings(merged);
        const hasChanges = JSON.stringify(nextSettings) !== JSON.stringify(appSettings);
        appSettings = nextSettings;
        saveSettingsToStore(appSettings, settingsStorageAdapter);
        applySettings(appSettings, {
            skipFormSync: options.skipFormSync || false,
            skipTheme: options.skipTheme || false,
        });
        if (!options.silent && hasChanges) {
            announce(options.message || 'Settings updated.');
        }
    };

    skinOptions.forEach((option, index) => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            focusSkinOption(index);
            const selectedSkin = selectSkinOption(option);
            commitSettings({ theme: selectedSkin }, { silent: true, skipTheme: true });
            hideElement(skinSelector);
            skinSelector.setAttribute('aria-hidden', 'true');
            themeToggle.setAttribute('aria-expanded', 'false');
            timerContainer.focus();
        });

        option.addEventListener('keydown', (event) => {
            const currentIndex = skinOptions.indexOf(event.currentTarget);
            let handled = false;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                const nextIndex = (currentIndex + 1) % skinOptions.length;
                focusSkinOption(nextIndex);
                const selected = selectSkinOption(skinOptions[nextIndex]);
                commitSettings({ theme: selected }, { silent: true, skipTheme: true });
                handled = true;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + skinOptions.length) % skinOptions.length;
                focusSkinOption(prevIndex);
                const selected = selectSkinOption(skinOptions[prevIndex]);
                commitSettings({ theme: selected }, { silent: true, skipTheme: true });
                handled = true;
            } else if (event.key === 'Home') {
                focusSkinOption(0);
                const selected = selectSkinOption(skinOptions[0]);
                commitSettings({ theme: selected }, { silent: true, skipTheme: true });
                handled = true;
            } else if (event.key === 'End') {
                const lastIndex = skinOptions.length - 1;
                focusSkinOption(lastIndex);
                const selected = selectSkinOption(skinOptions[lastIndex]);
                commitSettings({ theme: selected }, { silent: true, skipTheme: true });
                handled = true;
            } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
                const selected = selectSkinOption(option);
                commitSettings({ theme: selected }, { silent: true, skipTheme: true });
                hideElement(skinSelector);
                skinSelector.setAttribute('aria-hidden', 'true');
                themeToggle.setAttribute('aria-expanded', 'false');
                timerContainer.focus();
                handled = true;
            }

            if (handled) {
                event.preventDefault();
            }
        });
    });

    applySettings(appSettings);

    const initialActiveOption = skinOptions.find(btn => btn.classList.contains('active'));
    if (initialActiveOption) {
        const optionId = initialActiveOption.id || `skin-option-${initialActiveOption.getAttribute('data-skin')}`;
        initialActiveOption.id = optionId;
        if (skinOptionsGroup) {
            skinOptionsGroup.setAttribute('aria-activedescendant', optionId);
        }
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            const selectedOption = themeSelect.options[themeSelect.selectedIndex];
            const label = selectedOption ? selectedOption.textContent.trim() : themeSelect.value;
            announce(`Theme set to ${label || themeSelect.value}.`);
        });
    }

    if (beepVolumeInput) {
        beepVolumeInput.addEventListener('input', updateBeepVolumeLabel);
    }

    const openSettings = () => {
        if (!settingsMenu) {
            warn('BuzzTimer: attempted to open settings without modal element.');
            return;
        }

        if (settingsBtn && settingsBtn.dataset.state === 'open') {
            return;
        }

        document.body.style.overflow = 'hidden';
        if (appRoot) {
            appRoot.classList.add('modal-open');
        }
        if (appContent) {
            appContent.setAttribute('aria-hidden', 'true');
        }
        const settingsToggle = document.getElementById('settings-btn') || settingsBtn;
        if (settingsToggle) {
            settingsToggle.setAttribute('aria-expanded', 'true');
        }

        openModal('settings', settingsBtn || settingsToggle);

        setTimeout(() => {
            const heading = document.getElementById('settingsTitle');
            if (heading && typeof heading.focus === 'function') {
                try {
                    heading.focus({ preventScroll: true });
                } catch (error) {
                    heading.focus();
                }
            }
        }, 0);
    };

    const closeSettings = (message) => {
        syncSettingsForm();
        closeModal('settings');

        const noOpenModals = openModals.size === 0;

        if (noOpenModals) {
            document.body.style.overflow = '';
            if (appRoot) {
                appRoot.classList.remove('modal-open');
            }
            if (appContent) {
                appContent.removeAttribute('aria-hidden');
                appContent.removeAttribute('inert');
            }
        }
        const settingsToggle = document.getElementById('settings-btn') || settingsBtn;
        if (settingsToggle) {
            settingsToggle.setAttribute('aria-expanded', 'false');
        }
        if (message) {
            announce(message);
        }
    };

    if (closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeSettings('Settings closed.');
        });
    }

    if (settingsCancelBtn) {
        settingsCancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeSettings('Settings closed. No changes saved.');
        });
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nextSettings = {
                theme: themeSelect ? themeSelect.value : appSettings.theme,
                enablePulseGlow: pulseGlowToggle ? pulseGlowToggle.checked : appSettings.enablePulseGlow,
                enableBeep: enableBeepToggle ? enableBeepToggle.checked : appSettings.enableBeep,
                beepVolume: beepVolumeInput ? parseFloat(beepVolumeInput.value) : appSettings.beepVolume,
                autoStart: autoStartToggle ? autoStartToggle.checked : appSettings.autoStart,
                confirmReset: confirmResetToggle ? confirmResetToggle.checked : appSettings.confirmReset,
                reduceMotionRespect: reduceMotionToggle ? reduceMotionToggle.checked : appSettings.reduceMotionRespect,
                historyRetention: historySizeInput ? parseInt(historySizeInput.value, 10) : appSettings.historyRetention,
                announceCadence: announceCadenceSelect ? announceCadenceSelect.value : appSettings.announceCadence,
            };

            if (!Number.isFinite(nextSettings.beepVolume)) {
                nextSettings.beepVolume = appSettings.beepVolume;
            }
            if (!Number.isFinite(nextSettings.historyRetention)) {
                nextSettings.historyRetention = appSettings.historyRetention;
            }

            commitSettings(nextSettings, { message: 'Settings saved.' });
            closeSettings();
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettings();
        });
    }

    if (reduceMotionQuery) {
        const handleReduceMotionChange = () => {
            syncReduceMotionClass();
            setTimerRunningVisual(timer.isRunning());
        };
        if (typeof reduceMotionQuery.addEventListener === 'function') {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
        } else if (typeof reduceMotionQuery.addListener === 'function') {
            reduceMotionQuery.addListener(handleReduceMotionChange);
        }
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', handleVisibilitySync);
    }
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', () => {
        persistTimerState();
    });

    const restored = restoreTimerState();
    if (!restored) {
        handleTimerTick(timer.getElapsedMs());
    }
    setStartButtonState(timer.isRunning() ? 'pause' : 'start');
    setTimerRunningVisual(timer.isRunning());
    log('Timer and theme logic restored.');

    if (logBtn) {
        logBtn.addEventListener('click', () => {
            clearAppAlert();
            if (momentEffectInput) {
                momentEffectInput.value = '';
            }
            openModal('log', logBtn);
            log('Log Moment modal opened');
        });
    }

    if (momentForm) {
        momentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const momentText = (momentEffectInput ? momentEffectInput.value : '').trim();
            if (!momentText) {
                showAppAlert('Enter a moment before saving.');
                if (momentEffectInput && typeof momentEffectInput.focus === 'function') {
                    momentEffectInput.focus();
                }
                log('Log Moment input is empty');
                return;
            }

            const elapsedSeconds = getElapsedSeconds();
            const timeString = formatTime(elapsedSeconds);
            addLogEntry({
                type: 'moment',
                timeText: timeString,
                timeISO: toISODuration(elapsedSeconds),
                text: momentText,
            });

            if (momentEffectInput) {
                momentEffectInput.value = '';
            }
            closeModal('log');
            showAppAlert(`Moment logged at ${timeString}.`);
            log(`Log Moment saved: "${momentText}" at ${timeString}`);
        });
    }

    if (momentCancelBtn) {
        momentCancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (momentEffectInput) {
                momentEffectInput.value = '';
            }
            closeModal('log');
            log('Log Moment modal cancelled.');
        });
    }

    if (highIdeaBtn) {
        highIdeaBtn.addEventListener('click', () => {
            clearAppAlert();
            if (ideaTextarea) {
                ideaTextarea.value = '';
            }
            openModal('highIdea', highIdeaBtn);
            log('High Idea modal opened');
        });
    }

    const normalizeIdeaText = (raw) => {
        if (!raw) return '';
        return raw
            .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
            .replace(/__([\s\S]+?)__/g, '$1')
            .replace(/_([\s\S]+?)_/g, '$1')
            .trim();
    };

    const applyIdeaFormatting = (format) => {
        if (!ideaTextarea) {
            return;
        }
        const el = ideaTextarea;
        const { selectionStart, selectionEnd, value } = el;
        if (selectionStart === undefined || selectionEnd === undefined) {
            return;
        }
        const prefix = value.slice(0, selectionStart);
        const selected = value.slice(selectionStart, selectionEnd);
        const suffix = value.slice(selectionEnd);

        const tokens = {
            bold: ['**', '**'],
            italic: ['_', '_'],
            underline: ['__', '__'],
        };
        const [openToken, closeToken] = tokens[format] || ['', ''];
        if (!openToken && !closeToken) {
            return;
        }

        const content = selected || '';
        const replacement = `${openToken}${content}${closeToken}`;
        const nextValue = `${prefix}${replacement}${suffix}`;

        el.value = nextValue;
        const caretStart = selectionStart + openToken.length;
        const caretEnd = caretStart + content.length;
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(caretStart, caretEnd);
        });
    };

    if (Array.isArray(ideaFormattingButtons) && ideaFormattingButtons.length > 0) {
        ideaFormattingButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const format = button.dataset.format;
                applyIdeaFormatting(format);
            });
        });
    }

    if (ideaForm) {
        ideaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const ideaContent = ideaTextarea ? ideaTextarea.value.trim() : '';
            if (!ideaContent) {
                showAppAlert('Add some notes before saving your idea.');
                if (ideaTextarea) {
                    ideaTextarea.focus();
                }
                log('High Idea content is empty');
                return;
            }

            const elapsedSeconds = getElapsedSeconds();
            const timeString = formatTime(elapsedSeconds);
            const displayText = normalizeIdeaText(ideaContent) || ideaContent;
            addLogEntry({
                type: 'idea',
                timeText: timeString,
                timeISO: toISODuration(elapsedSeconds),
                text: displayText,
            });

            if (ideaTextarea) {
                ideaTextarea.value = '';
            }
            announce('Idea saved.');
            closeModal('highIdea');
            showAppAlert(`High idea saved at ${timeString}.`);
            log(`High Idea saved: "${ideaContent}" at ${timeString}`);
        });
    }

    if (ideaCancelBtn) {
        ideaCancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (ideaTextarea) {
                ideaTextarea.value = '';
            }
            closeModal('highIdea');
            log('High Idea modal cancelled.');
        });
    }

    distractMeBtn.addEventListener('click', () => {
        openModal('entertainment', distractMeBtn);
    });

    dismissEntertainment.addEventListener('click', () => closeModal('entertainment'));

    let shareType = 'simple'; 

    const openShareModal = (triggerEl) => {
        clearShareFeedback();
        openModal('share', triggerEl || logsShareButton || shareBtn);
        updateSharePreview();
    };

    if (logsShareButton) {
        logsShareButton.addEventListener('click', (event) => {
            event.preventDefault();
            openShareModal(event.currentTarget);
        });
    }

    if (sdmShareBtn) {
        sdmShareBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeSessionDetailsModal();
            openShareModal(sdmShareBtn);
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', (event) => {
            event.preventDefault();
            log('Share button clicked!');
            openShareModal(event.currentTarget);
        });
    }

    if (sdmAddDoseBtn) {
        sdmAddDoseBtn.addEventListener('click', () => {
            log('Session Details: Add Dose coming soon.');
        });
    }

    if (sdmHistoryBtn) {
        sdmHistoryBtn.addEventListener('click', () => {
            log('Session Details: Session History coming soon.');
        });
    }

    simpleShareBtn.addEventListener('click', () => {
        shareType = 'simple';
        updateSharePreview();
        simpleShareBtn.classList.add('active');
        detailedShareBtn.classList.remove('active');
        clearShareFeedback();
    });

    detailedShareBtn.addEventListener('click', () => {
        shareType = 'detailed';
        updateSharePreview();
        detailedShareBtn.classList.add('active');
        simpleShareBtn.classList.remove('active');
        clearShareFeedback();
    });

    const getShareProductName = () => {
        const details = getActiveSession() || getLastSession();
        return details && details.productName ? details.productName : 'No strain specified';
    };

    const updateSharePreview = () => {
        const customMessage = shareMessage.value.trim();
        const friendlyTheme = `${themeNames[currentSkin] || 'Classic'} Theme`;

        if (shareType === 'simple') {
            sharePreview.textContent = `
                ${customMessage}
                Theme: ${friendlyTheme}
                Learn more at BuzzTimer.com
            `.trim();
        } else {
            const logItems = logList ? Array.from(logList.children) : [];
            const loggedMoments = logItems
                .map(entry => entry.textContent.trim())
                .join('\n');
            const strainInfo = getShareProductName();

            sharePreview.textContent = `
                ${customMessage}
                Theme: ${friendlyTheme}
                Strain: ${strainInfo}
                Logged Moments:\n${loggedMoments}
                Learn more at BuzzTimer.com
            `.trim();
        }
    };

    shareTwitter.addEventListener('click', () => {
        const message = sharePreview.textContent.trim();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    shareFacebook.addEventListener('click', () => {
        const message = sharePreview.textContent.trim();
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    copyLink.addEventListener('click', () => {
        const shareText = sharePreview.textContent.trim();
        navigator.clipboard.writeText(shareText).then(() => {
            showShareFeedback('Link copied to clipboard.');
        }).catch(() => {
            showShareFeedback('Unable to copy automatically. Copy the text manually.');
        });
    });

    shareMessage.addEventListener('input', () => {
        updateSharePreview();
        clearShareFeedback();
    });

    const updateDarkModeToggle = () => {
        const isLightMode = document.body.classList.contains('light-mode');
        darkModeToggle.dataset.mode = isLightMode ? 'light' : 'dark';
        darkModeToggle.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
        darkModeToggle.setAttribute('aria-pressed', isLightMode ? 'true' : 'false');
        return isLightMode;
    };

    // Dark/Light Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = updateDarkModeToggle();
        log(`Light mode is now ${isLight ? 'ON' : 'OFF'}`);
    });

    updateDarkModeToggle();
});
