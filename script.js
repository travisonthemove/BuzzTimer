document.addEventListener('DOMContentLoaded', () => {
    console.log("Script successfully loaded and executed");

    // DOM Elements
    const sessionBanner = document.getElementById('sessionBanner');
    const sessionDetails = document.getElementById('sessionDetails');
    const expandSessionBtn = document.getElementById('expandSessionBtn');
    const saveSessionDetailsBtn = document.getElementById('saveSessionDetailsBtn');
    const productNameInput = document.getElementById('productName'); // Strain input
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
    const momentInput = document.getElementById('momentInput');
    const saveLogMoment = document.getElementById('saveLogMoment');
    const logList = document.getElementById('logList');
    const highIdeaBtn = document.getElementById('highIdeaBtn');
    const highIdeaModal = document.getElementById('highIdeaModal');
    const richTextEditor = document.getElementById('richTextEditor');
    const saveHighIdea = document.getElementById('saveHighIdea');
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
    const productName = document.getElementById('productName');
    const timerContainer = document.getElementById('timerContainer');
    const timerDisplay = document.getElementById('timer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    // Settings & history controls
    const settingsBtn = document.getElementById('settingsBtn');
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
    const updateBeepVolumeLabel = () => {
        if (!beepVolumeInput || !beepVolumeValue) {
            return;
        }
        const raw = parseFloat(beepVolumeInput.value);
        const percent = Number.isFinite(raw) ? Math.round(raw * 100) : Math.round((appSettings?.beepVolume ?? 0.6) * 100);
        beepVolumeValue.textContent = `${percent}%`;
    };
    const appAlerts = document.getElementById('appAlerts');
    const timerLive = document.getElementById('timerLive');
    const historyModal = document.getElementById('historyModal');
    const historyBackdrop = document.getElementById('historyBackdrop');
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const closeHistoryBtn = document.getElementById('closeHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');
    const historyHelp = document.getElementById('historyHelp');
    const openModals = new Map();

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
    let lastAnnouncedMinute = -1;
    let resetConfirmPending = false;
    let resetConfirmTimeout;
    let currentElapsedMs = 0;
    let beepAudioContext = null;

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
            console.warn('BuzzTimer: unable to read storage key', key, error);
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
            console.warn('BuzzTimer: unable to persist storage key', key, error);
        }
    };

    const safeStorageRemove = (key) => {
        if (!canUseStorage()) {
            return;
        }
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn('BuzzTimer: unable to remove storage key', key, error);
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
            console.warn('BuzzTimer: unable to parse storage key', key, error);
            return null;
        }
    };

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
            console.warn('BuzzTimer: unable to format date', timestamp, error);
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
            console.warn('BuzzTimer: unable to persist sessions', error);
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
            console.warn('BuzzTimer: unable to export sessions', error);
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

    const hideElement = (element) => {
        element.classList.add('hidden');
    };

    const showElement = (element) => {
        element.classList.remove('hidden');
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
                console.warn('BuzzTimer: unable to initialise audio context', error);
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
            console.warn('BuzzTimer: unable to play beep', error);
        }
    };

    const triggerHaptics = () => {
        if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
            return;
        }
        try {
            navigator.vibrate(60);
        } catch (error) {
            console.warn('BuzzTimer: unable to trigger vibration', error);
        }
    };

    const notifyCadenceTick = (minutes) => {
        if (!appSettings || !appSettings.enableBeep) {
            return;
        }
        playBeep();
        triggerHaptics();
        console.log(`Cadence notification fired at minute ${minutes}`);
    };

    const updateTimerAnnouncement = (force = false) => {
        if (!timerLive) return;
        const minutes = Math.max(0, Math.floor(currentElapsedMs / 60000));
        if (!force && minutes === lastAnnouncedMinute) {
            return;
        }

        const cadenceStep = ANNOUNCEMENT_STEPS[announcementCadence] ?? 0;
        const shouldAnnounce = cadenceStep === 0
            ? minutes === 0
            : minutes === 0 || minutes % cadenceStep === 0;

        if (!shouldAnnounce) {
            lastAnnouncedMinute = minutes;
            return;
        }

        lastAnnouncedMinute = minutes;
        let announcement;
        if (minutes === 0) {
            announcement = 'Timer 0 minutes';
        } else if (minutes === 1) {
            announcement = 'Timer 1 minute';
        } else {
            announcement = `Timer ${minutes} minutes`;
        }
        timerLive.textContent = announcement;

        if (!force && minutes > 0 && cadenceStep > 0) {
            notifyCadenceTick(minutes);
        }
    };

    const handleTimerTick = (elapsedMs) => {
        currentElapsedMs = Math.max(0, elapsedMs);
        updateTimerDisplay();
        updateTimerAnnouncement();
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
            console.warn('BuzzTimer: unable to persist timer state', error);
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
            lastAnnouncedMinute = -1;
            timer.setState({
                accumulatedMs,
                isRunning: wasRunning,
            });
            persistTimerState();
            return true;
        } catch (error) {
            console.warn('BuzzTimer: unable to restore timer state', error);
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
        console.log('Timer started');
    };

    const pauseTimer = () => {
        if (!timer.isRunning()) {
            return;
        }
        timer.pause();
        setStartButtonState('start');
        setTimerRunningVisual(false);
        persistTimerState({ startWallClock: null });
        console.log('Timer paused');
    };

    const collapseSessionDetails = () => {
        hideElement(sessionDetails);
        showElement(sessionBanner);
        timerContainer.focus();
        console.log('Session details collapsed');
    };

    const expandSessionDetails = () => {
        hideElement(sessionBanner);
        showElement(sessionDetails);
        productNameInput.focus();
        console.log('Session details expanded');
    };

    saveSessionDetailsBtn.addEventListener('click', () => {
        hideElement(sessionDetails);
        sessionDetailsSaved = true;
        console.log('Session details saved');
        timerContainer.focus();

        sessionBanner.innerHTML = `
            <div class="save-confirm" role="status" aria-live="polite">
                <span>Session details saved!</span>
                <button id="expandSessionBtn2" type="button" data-tippy-content="Edit your session details.">
                    Edit Details
                </button>
            </div>`;

        const expandSessionBtn2 = document.getElementById('expandSessionBtn2');
        if (expandSessionBtn2) {
            expandSessionBtn2.addEventListener('click', expandSessionDetails);
        }

        const saveConfirmEl = sessionBanner.querySelector('.save-confirm');

        if (saveConfirmEl && !shouldReduceMotion()) {
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

        showElement(sessionBanner);

        if (appSettings.autoStart && !timer.isRunning()) {
            startTimer();
        }
    });

    startBtn.addEventListener('click', () => {
        if (!sessionDetailsSaved) {
            expandSessionDetails();
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

        lastAnnouncedMinute = -1;
        timer.reset();
        setStartButtonState('start');
        setTimerRunningVisual(false);
        persistTimerState({ isRunning: false, startWallClock: null, accumulatedMs: 0 });
        console.log('Timer reset');

        sessionDetailsSaved = false;
        productNameInput.value = '';
        document.getElementById('consumptionMethod').value = '';
        document.getElementById('doseAmount').value = '';
        document.getElementById('doseUnit').value = 'mg';

        sessionBanner.innerHTML = `
            <p>
                Want to add more details to your session?
                <button id="expandSessionBtn">Expand</button>
            </p>`;
        showElement(sessionBanner);
        hideElement(sessionDetails);

        logList.innerHTML = '';
        console.log("Log list cleared");

        closeModal('log');
        closeModal('highIdea');
        closeModal('share');
        closeModal('entertainment');

        timerContainer.focus();
        showAppAlert('Session reset. Timer 0 minutes.');

        document.getElementById('expandSessionBtn').addEventListener('click', expandSessionDetails);
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
        console.log('Theme selector toggled');
    });


    const modalConfig = {
        settings: {
            modal: settingsMenu,
            backdrop: settingsBackdrop,
            focusFirst: () => {
                if (themeSelect && typeof themeSelect.focus === 'function') {
                    themeSelect.focus();
                    return;
                }
                if (settingsMenu) {
                    const heading = settingsMenu.querySelector('#settingsTitle');
                    if (heading && typeof heading.focus === 'function') {
                        heading.focus();
                    } else if (typeof settingsMenu.focus === 'function') {
                        settingsMenu.focus();
                    }
                }
            },
            onOpen: () => {
                syncSettingsForm();
                if (settingsBtn) {
                    settingsBtn.setAttribute('aria-expanded', 'true');
                }
                if (settingsLiveRegion) {
                    settingsLiveRegion.textContent = '';
                }
            },
            onClose: () => {
                if (settingsBtn) {
                    settingsBtn.setAttribute('aria-expanded', 'false');
                }
            },
            closeOnBackdrop: true,
        },
        log: {
            modal: logModal,
            focusFirst: () => saveLogMoment.focus(),
        },
        highIdea: {
            modal: highIdeaModal,
            focusFirst: () => saveHighIdea.focus(),
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
            onOpen: () => document.body.classList.add('modal-open'),
            onClose: () => document.body.classList.remove('modal-open'),
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
        if (backdrop) {
            showElement(backdrop);
            backdrop.classList.remove('hidden');
            backdrop.setAttribute('aria-hidden', 'false');
        }
        showElement(modal);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        openModals.set(modal, opener || document.activeElement);
        if (typeof onOpen === 'function') {
            onOpen();
        }
        setTimeout(() => {
            if (typeof focusFirst === 'function') {
                focusFirst();
            } else {
                modal.focus();
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
        if (opener && typeof opener.focus === 'function') {
            opener.focus();
        }
        openModals.delete(modal);
    };

    Object.entries(modalConfig).forEach(([key, config]) => {
        const { modal, backdrop, closeOnBackdrop } = config;
        if (!modal) return;

        modal.setAttribute('tabindex', '-1');

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(key));
        }

        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                trapFocus(modal, event);
            } else if (event.key === 'Escape') {
                closeModal(key);
            }
        });

        if (closeOnBackdrop) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(key);
                }
            });
        }

        if (backdrop) {
            backdrop.setAttribute('aria-hidden', 'true');
            backdrop.addEventListener('click', (event) => {
                if (event.target === backdrop) {
                    closeModal(key);
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
        console.log(`Selected skin: ${selectedSkin}`);

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
        updateTimerAnnouncement(true);
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
        if (!options.silent && settingsLiveRegion && hasChanges) {
            settingsLiveRegion.textContent = options.message || 'Settings updated.';
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

    if (beepVolumeInput) {
        beepVolumeInput.addEventListener('input', updateBeepVolumeLabel);
    }

    const dismissSettingsModal = (message) => {
        syncSettingsForm();
        closeModal('settings');
        if (settingsLiveRegion && message) {
            settingsLiveRegion.textContent = message;
        }
    };

    if (settingsCancelBtn) {
        settingsCancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            dismissSettingsModal('Settings closed. No changes saved.');
        });
    }

    if (closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', (event) => {
            event.preventDefault();
            dismissSettingsModal('Settings closed.');
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
            closeModal('settings');
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openModal('settings', settingsBtn);
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
    console.log('Timer and theme logic restored.');

    logBtn.addEventListener('click', () => {
        clearAppAlert();
        openModal('log', logBtn);
        console.log("Log Moment modal opened");
    });

    saveLogMoment.addEventListener('click', () => {
        const momentText = momentInput.value.trim();
        if (momentText) {
            const timeString = formatTime(getElapsedSeconds());

            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');
            const momentContent = `
                <span class="log-time">${timeString}</span>
                <span class="log-label">${momentText}</span>
            `;
            logEntry.innerHTML = momentContent;

            logList.appendChild(logEntry);
            const logsSection = document.querySelector('.logs');
            showElement(logsSection);

            momentInput.value = '';
            closeModal('log');
            showAppAlert(`Moment logged at ${timeString}.`);
            console.log(`Log Moment saved: "${momentText}" at ${timeString}`);
        } else {
            showAppAlert('Enter a moment before saving.');
            console.log("Log Moment input is empty");
        }
    });

    highIdeaBtn.addEventListener('click', () => {
        clearAppAlert();
        openModal('highIdea', highIdeaBtn);
        console.log("High Idea modal opened");
    });

    saveHighIdea.addEventListener('click', () => {
        const ideaContent = richTextEditor.innerHTML.trim();
        if (ideaContent) {
            const timeString = formatTime(getElapsedSeconds());

            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');
            const ideaContentHtml = `
                <span class="log-time">${timeString}</span>
                <div class="log-label idea-content">${ideaContent}</div>
            `;
            logEntry.innerHTML = ideaContentHtml;

            logList.appendChild(logEntry);
            const logsSection = document.querySelector('.logs');
            showElement(logsSection);

            richTextEditor.innerHTML = '';
            closeModal('highIdea');
            showAppAlert(`High idea saved at ${timeString}.`);
            console.log(`High Idea saved: "${ideaContent}" at ${timeString}`);
        } else {
            showAppAlert('Add some notes before saving your idea.');
            console.log("High Idea content is empty");
        }
    });

    distractMeBtn.addEventListener('click', () => {
        openModal('entertainment', distractMeBtn);
    });

    dismissEntertainment.addEventListener('click', () => closeModal('entertainment'));

    let shareType = 'simple'; 

    shareBtn.addEventListener('click', () => {
        console.log('Share button clicked!');
        openModal('share', shareBtn);
        updateSharePreview();
    });

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
            const loggedMoments = Array.from(logList.children)
                .map(entry => entry.textContent.trim())
                .join('\n');
            const strainInfo = productName.value.trim() || 'No strain specified';

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
        console.log(`Light mode is now ${isLight ? 'ON' : 'OFF'}`);
    });

    updateDarkModeToggle();
});
