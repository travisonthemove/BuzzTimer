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
    const timerSkin = document.getElementById('timerSkin');
    const skinOptions = document.querySelectorAll('.skin-option');
    const themeToggle = document.getElementById('themeToggle');
    const logBtn = document.getElementById('logBtn');
    const logModal = document.getElementById('logModal');
    const momentInput = document.getElementById('momentInput');
    const saveLogMoment = document.getElementById('saveLogMoment');
    const logList = document.getElementById('logList');
    const closeModalBtn = logModal.querySelector('.close');
    const highIdeaBtn = document.getElementById('highIdeaBtn');
    const highIdeaModal = document.getElementById('highIdeaModal');
    const richTextEditor = document.getElementById('richTextEditor');
    const saveHighIdea = document.getElementById('saveHighIdea');
    const closeHighIdeaModalBtn = highIdeaModal.querySelector('.close');
    const entertainmentModal = document.getElementById('entertainmentModal');
    const closeEntertainmentModal = entertainmentModal.querySelector('.close');
    const dismissEntertainment = document.getElementById('dismissEntertainment');
    const distractMeBtn = document.getElementById('distractMeBtn');   
    const shareModalBackdrop = document.getElementById('shareModalBackdrop');
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const shareMessage = document.getElementById('shareMessage');
    const sharePreview = document.getElementById('sharePreview');
    const simpleShareBtn = document.getElementById('simpleShareBtn');
    const detailedShareBtn = document.getElementById('detailedShareBtn');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareFacebook = document.getElementById('shareFacebook');
    const copyLink = document.getElementById('copyLink');
    const productName = document.getElementById('productName');

    // Reference to the timer container (which has tabindex="-1" in HTML)
    const timerContainer = document.getElementById('timerContainer');
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');


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

    const startTimer = () => {
        if (!isRunning) {
            timerInterval = setInterval(() => {
                elapsedSeconds++;
                updateTimerDisplay();
            }, 1000);
            startBtn.textContent = 'Pause';
            isRunning = true;
            console.log('Timer started');
        }
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        startBtn.textContent = 'Start';
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
        startBtn.textContent = 'Start';
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

        hideElement(logModal);
        console.log("Log Moment modal hidden");

        timerContainer.focus();

        document.getElementById('expandSessionBtn').addEventListener('click', expandSessionDetails);
    });

    themeToggle.addEventListener('click', () => {
        if (skinSelector.classList.contains('hidden')) {
            showElement(skinSelector);
        skinSelector.focus(); // Focus the panel now that it's visible
        } else {
            hideElement(skinSelector);
            timerContainer.focus();
        }
        console.log("Theme selector toggled");
    });

    skinOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.stopPropagation(); 

            skinOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

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

            hideElement(skinSelector);
            timerContainer.focus();
        });
    });

    updateTimerDisplay();
    console.log('Timer and theme logic restored.');

    logBtn.addEventListener('click', () => {
        showElement(logModal);
        momentInput.focus();
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
            hideElement(logModal);
            timerContainer.focus();
            console.log(`Log Moment saved: "${momentText}" at ${timeString}`);
        } else {
            console.log("Log Moment input is empty");
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !logModal.classList.contains('hidden')) {
            hideElement(logModal);
            timerContainer.focus();
            console.log("Log Moment modal closed via Escape key");
        }
    });

    highIdeaBtn.addEventListener('click', () => {
        showElement(highIdeaModal);
        richTextEditor.focus();
        console.log("High Idea modal opened");
    });

saveHighIdea.addEventListener('click', () => {
    const ideaContent = richTextEditor.innerHTML.trim();
    if (ideaContent) {
        // Use the timer's elapsed time instead of current wall clock time
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
        hideElement(highIdeaModal);
        timerContainer.focus();
        console.log(`High Idea saved: "${ideaContent}" at ${timeString}`);
    } else {
        console.log("High Idea content is empty");
    }
});

    const closeHighIdeaModal = () => {
        hideElement(highIdeaModal);
        timerContainer.focus();
        console.log("High Idea modal closed");
    };

    closeHighIdeaModalBtn.addEventListener('click', closeHighIdeaModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !highIdeaModal.classList.contains('hidden')) {
            closeHighIdeaModal();
            console.log("High Idea modal closed via Escape key");
        }
    });

let shareType = 'simple'; 

shareBtn.addEventListener('click', () => {
    console.log('Share button clicked!');
    showElement(shareModal);
    showElement(shareModalBackdrop);
    updateSharePreview();
});

closeShareModal.addEventListener('click', () => {
    hideElement(shareModal);
    hideElement(shareModalBackdrop);
    timerContainer.focus();
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

// Move this listener outside of the copyLink event
shareMessage.addEventListener('input', updateSharePreview);

shareModalBackdrop.addEventListener('click', (event) => {
    if (event.target === shareModalBackdrop) {
        hideElement(shareModal);
        hideElement(shareModalBackdrop);
        timerContainer.focus();
    }
});

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !shareModal.classList.contains('hidden')) {
            hideElement(shareModal);
            hideElement(shareModalBackdrop);
            timerContainer.focus();
        }
    });

    const toggleModal = (show) => {
        if (show) {
            showElement(entertainmentModal);
            document.body.classList.add('modal-open');
            entertainmentModal.querySelector('.modal-content').setAttribute('tabindex', '-1');
            entertainmentModal.querySelector('.modal-content').focus();
        } else {
            hideElement(entertainmentModal);
            document.body.classList.remove('modal-open');
            timerContainer.focus();
        }
    };

    distractMeBtn.addEventListener('click', () => toggleModal(true));
    closeEntertainmentModal.addEventListener('click', () => toggleModal(false));
    dismissEntertainment.addEventListener('click', () => toggleModal(false));

    entertainmentModal.addEventListener('click', (event) => {
        if (event.target === entertainmentModal) toggleModal(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !entertainmentModal.classList.contains('hidden')) {
            toggleModal(false);
        }
    });
// Dark Light Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('darkModeToggle');
    const isDark = document.body.classList.contains('darkModeToggle');
    darkModeToggle.innerHTML = isDark ? '🌙' : '☀️';
});});
