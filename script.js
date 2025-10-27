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
    const productName = document.getElementById('productName');
    const timerContainer = document.getElementById('timerContainer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    // ToDo  NEW: Grab the Settings button
    const settingsBtn = document.getElementById('settingsBtn');
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
    let timerInterval;
    let elapsedSeconds = 0;
    let isRunning = false;
    let sessionDetailsSaved = false;

    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    const updateTimerDisplay = () => {
        document.getElementById('timer').textContent = formatTime(elapsedSeconds);
    };

    const hideElement = (element) => {
        element.classList.add('hidden');
    };

    const showElement = (element) => {
        element.classList.remove('hidden');
    };

    const setStartButtonState = (state) => {
        startBtn.dataset.state = state;
        const label = state === 'pause' ? 'Pause' : 'Start';
        startBtn.setAttribute('aria-label', label);
    };

    const startTimer = () => {
        if (!isRunning) {
            timerInterval = setInterval(() => {
                elapsedSeconds++;
                updateTimerDisplay();
            }, 1000);
            setStartButtonState('pause');
            isRunning = true;
            console.log('Timer started');
        }
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        setStartButtonState('start');
        isRunning = false;
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
            <p>
                Session details saved!
                <button id="expandSessionBtn2">Edit Details</button>
            </p>`;
        const expandSessionBtn2 = document.getElementById('expandSessionBtn2');
        expandSessionBtn2.addEventListener('click', expandSessionDetails);

        showElement(sessionBanner);

        if (!isRunning) {
            startTimer();
        }
    });

    startBtn.addEventListener('click', () => {
        if (!sessionDetailsSaved) {
            expandSessionDetails();
            return;
        }

        if (!isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    resetBtn.addEventListener('click', () => {
        const confirmReset = confirm("Are you sure you want to reset?");
        if (!confirmReset) {
            console.log("Reset canceled by user");
            return;
        }

        clearInterval(timerInterval);
        elapsedSeconds = 0;
        updateTimerDisplay();
        setStartButtonState('start');
        isRunning = false;
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
        console.log("Log Moment modal hidden");

        timerContainer.focus();

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
        log: {
            modal: logModal,
            focusFirst: () => momentInput.focus(),
        },
        highIdea: {
            modal: highIdeaModal,
            focusFirst: () => richTextEditor.focus(),
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
            focusFirst: () => shareMessage.focus(),
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

    skinOptions.forEach((option, index) => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            focusSkinOption(index);
            selectSkinOption(option);
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
                selectSkinOption(skinOptions[nextIndex]);
                handled = true;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + skinOptions.length) % skinOptions.length;
                focusSkinOption(prevIndex);
                selectSkinOption(skinOptions[prevIndex]);
                handled = true;
            } else if (event.key === 'Home') {
                focusSkinOption(0);
                selectSkinOption(skinOptions[0]);
                handled = true;
            } else if (event.key === 'End') {
                const lastIndex = skinOptions.length - 1;
                focusSkinOption(lastIndex);
                selectSkinOption(skinOptions[lastIndex]);
                handled = true;
            } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
                selectSkinOption(option);
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

    const initialActiveOption = skinOptions.find(btn => btn.classList.contains('active'));
    if (initialActiveOption) {
        const optionId = initialActiveOption.id || `skin-option-${initialActiveOption.getAttribute('data-skin')}`;
        initialActiveOption.id = optionId;
        if (skinOptionsGroup) {
            skinOptionsGroup.setAttribute('aria-activedescendant', optionId);
        }
    }

    setStartButtonState('start');
    updateTimerDisplay();
    console.log('Timer and theme logic restored.');

    // ========== SETTINGS BUTTON EVENT ==========
    // This ensures no error is thrown if `settingsBtn` is present in the HTML.
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // For now, do nothing or log a placeholder
            console.log('Settings button clicked. No action configured yet.');
        });
    }

    logBtn.addEventListener('click', () => {
        openModal('log', logBtn);
        console.log("Log Moment modal opened");
    });

    saveLogMoment.addEventListener('click', () => {
        const momentText = momentInput.value.trim();
        if (momentText) {
            const timeString = formatTime(elapsedSeconds);

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
            console.log(`Log Moment saved: "${momentText}" at ${timeString}`);
        } else {
            console.log("Log Moment input is empty");
        }
    });

    highIdeaBtn.addEventListener('click', () => {
        openModal('highIdea', highIdeaBtn);
        console.log("High Idea modal opened");
    });

    saveHighIdea.addEventListener('click', () => {
        const ideaContent = richTextEditor.innerHTML.trim();
        if (ideaContent) {
            const timeString = formatTime(elapsedSeconds);

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
            console.log(`High Idea saved: "${ideaContent}" at ${timeString}`);
        } else {
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
    });

    detailedShareBtn.addEventListener('click', () => {
        shareType = 'detailed';
        updateSharePreview();
        detailedShareBtn.classList.add('active');
        simpleShareBtn.classList.remove('active');
    });

    const updateSharePreview = () => {
        const customMessage = shareMessage.value.trim();
        const theme = themeContainer.classList[1] || 'Classic Theme';

        if (shareType === 'simple') {
            sharePreview.textContent = `
                ${customMessage}
                Theme: ${theme}
                Learn more at BuzzTimer.com
            `.trim();
        } else {
            const loggedMoments = Array.from(logList.children)
                .map(entry => entry.textContent.trim())
                .join('\n');
            const strainInfo = productName.value.trim() || 'No strain specified';

            sharePreview.textContent = `
                ${customMessage}
                Theme: ${theme}
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
            alert('Link copied to clipboard!');
        });
    });

    shareMessage.addEventListener('input', updateSharePreview);

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
