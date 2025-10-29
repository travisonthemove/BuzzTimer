from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")

modal_setup = """
    const modalConfig = {
        log: {
            modal: logModal,
            closeBtn: null,
            openers: [logBtn],
            focusFirst: () => momentInput.focus(),
        },
        highIdea: {
            modal: highIdeaModal,
            closeBtn: null,
            openers: [highIdeaBtn],
            focusFirst: () => richTextEditor.focus(),
        },
        entertainment: {
            modal: entertainmentModal,
            closeBtn: null,
            openers: [distractMeBtn],
            focusFirst: () => entertainmentModal.querySelector('.modal-content').focus(),
        },
        share: {
            modal: shareModal,
            closeBtn: null,
            openers: [shareBtn],
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
        const { modal, focusFirst } = config;
        showElement(modal);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        openModals.set(modal, opener || document.activeElement);
        setTimeout(() => {
            if (typeof focusFirst === 'function') {
                focusFirst();
            }
        }, 0);
    };

    const closeModal = (key) => {
        const config = modalConfig[key];
        if (!config) return;
        const { modal } = config;
        hideElement(modal);
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        const opener = openModals.get(modal);
        if (opener && typeof opener.focus === 'function') {
            opener.focus();
        }
        openModals.delete(modal);
    };

"""

insert_point = text.index('    const focusSkinOption')
text = text[:insert_point] + modal_setup + text[insert_point:]
path.write_text(text, encoding='utf-8')