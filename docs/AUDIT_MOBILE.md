# Mobile Touch Audit

## index.html
- Log modal lacked a native picker on touch, forcing datalist use that opens a desktop-styled list and allows the keyboard to occlude the form.
  - Before:
    ```html
    <form id="moment-form" novalidate>
      <label for="moment-effect">Enter or select an effect</label>
      <input id="moment-effect"
             type="text"
             name="momentEffect"
             list="moment-presets"
             autocomplete="off"
             placeholder="Custom moment or select...">
      <datalist id="moment-presets">…</datalist>
    </form>
    ```
  - After:
    ```html
    <form id="moment-form" novalidate>
      <div class="form-group moment-field">
        <label class="desktop-only" for="moment-effect">Enter or select an effect</label>
        <label class="touch-only" for="moment-effect-select">Select an effect</label>
        <select id="moment-effect-select" class="touch-only" name="momentEffectSelect" autocomplete="off">
          <option value="" disabled selected>Select effect...</option>
          …
          <option value="__custom">Custom effect...</option>
        </select>
        <div id="momentCustomField" class="moment-custom">
          <label class="touch-only" for="moment-effect">Custom effect</label>
          <input id="moment-effect" … placeholder="Custom moment or select...">
        </div>
        <datalist id="moment-presets">…</datalist>
      </div>
    </form>
    ```
- Safe-area handling and theme colors were missing, so the status bar could overlap controls and the browser chrome defaulted to grey.
  - Before:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```
  - After:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    ```
- Numeric fields lacked input hints, triggering full keyboards on mobile.
  - Before:
    ```html
    <input type="number" id="doseAmount" min="0" step="0.5" value="3">
    ```
  - After:
    ```html
    <input type="number" id="doseAmount" min="0" step="0.5" value="3" inputmode="decimal">
    ```

## styles.css
- No touch/desktop utility classes or safe-area padding, so touch-only affordances had to be injected via JS and the toolbar could collide with notches.
  - Before:
    ```css
    .top-actions {
        position: fixed;
        top: env(safe-area-inset-top, 16px);
        right: env(safe-area-inset-right, 16px);
        display: flex;
        gap: 12px;
        z-index: 10;
    }
    ```
  - After:
    ```css
    .touch-only { display: block; }
    .desktop-only { display: none; }
    @media (hover:hover) and (pointer:fine) {
        .touch-only { display: none; }
        .desktop-only { display: block; }
    }

    .top-actions {
        position: fixed;
        top: 16px;
        right: 16px;
        top: max(16px, env(safe-area-inset-top));
        right: max(16px, env(safe-area-inset-right));
        display: flex;
        gap: 16px;
        z-index: 10;
    }
    ```
- Modals were centered overlays using `calc(100vh)` and large drop shadows, which clipped against virtual keyboards and felt heavy on handheld devices.
  - Before:
    ```css
    .modal--moment {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(520px, 92vw);
        max-height: calc(100dvh - 8rem);
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    }
    ```
  - After:
    ```css
    .modal.sheet {
        align-items: flex-end;
        justify-content: center;
        padding: 0;
    }

    .modal--moment.sheet {
        left: 0;
        right: 0;
        bottom: 0;
        top: auto;
        transform: none;
        width: 100%;
        max-height: 80dvh;
        padding: 24px clamp(20px, 6vw, 32px);
        border-radius: 20px 20px 0 0;
        box-shadow: 0 -10px 28px rgba(0, 0, 0, 0.3);
    }
    ```
- Tap targets were below 44×44px, risking accidental misses on touchscreens.
  - Before:
    ```css
    .upper-controls button,
    .lower-controls button,
    .share-btn {
        padding: 0.8rem 1.2rem;
    }
    ```
  - After:
    ```css
    button,
    .btn,
    .share-btn,
    .control-btn {
        min-width: 44px;
        min-height: 44px;
    }
    input:not([type="range"]),
    select,
    textarea {
        min-height: 44px;
    }
    ```

## script.js
- No coarse-pointer detection or sheet presentation logic; touch users always received desktop modals and combobox behavior.
  - Before:
    ```js
    document.addEventListener('DOMContentLoaded', () => {
        …
        const logModal = document.getElementById('logModal');
        …
        const modalConfig = {
            log: {
                modal: logModal,
                backdrop: logBackdrop,
                focusFirst: () => {
                    const momentTitle = document.getElementById('moment-title');
                    …
                },
                closeOnBackdrop: true,
            },
        };
    });
    ```
  - After:
    ```js
    import { isTouch as initialIsTouch, isDesktop as initialIsDesktop, passiveOpts, touchMedia, desktopMedia } from './scripts/device.js';

    const passiveOptions = passiveOpts();

    document.addEventListener('DOMContentLoaded', () => {
        …
        let touchActive = initialIsTouch;
        …
        const syncDeviceState = () => {
            touchActive = touchMedia ? touchMedia.matches : initialIsTouch;
            desktopActive = desktopMedia ? desktopMedia.matches : initialIsDesktop;
            syncDeviceClasses();
            applyModalPresentation();
            syncMomentFieldForDevice();
        };
        …
        const modalConfig = {
            log: {
                modal: logModal,
                backdrop: logBackdrop,
                focusFirst: () => {
                    syncMomentFieldForDevice();
                    …
                },
                onOpen: () => {
                    syncMomentFieldForDevice();
                },
                onClose: () => {
                    resetMomentForm();
                },
                closeOnBackdrop: true,
            },
        };
    });
    ```
- Log moments still read `momentEffectInput.value`, so the new select never surfaced values.
  - Before:
    ```js
    const momentText = (momentEffectInput ? momentEffectInput.value : '').trim();
    if (!momentText) {
        showAppAlert('Enter a moment before saving.');
        …
    }
    ```
  - After:
    ```js
    const momentText = getMomentEffectValue();
    if (!momentText) {
        showAppAlert('Select or enter a moment before saving.');
        if (touchActive && momentEffectSelect) {
            …
        }
        return;
    }
    ```

## scripts/device.js
- Added a small helper module to expose coarse/fine pointer queries and passive listener detection without UA sniffing.
  ```js
  export const touchMedia = makeMediaQuery('(hover: none) and (pointer: coarse)');
  export const desktopMedia = makeMediaQuery('(hover: hover) and (pointer: fine)');
  export const isTouch = touchMedia.matches;
  export const isDesktop = desktopMedia.matches;
  export function passiveOpts() { … }
  ```
