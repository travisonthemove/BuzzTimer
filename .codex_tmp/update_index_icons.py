from pathlib import Path


def replace_section(text, start_marker, end_marker, replacement, include_end=False):
    start = text.index(start_marker)
    end = text.index(end_marker, start)
    if include_end:
        end += len(end_marker)
    return text[:start] + replacement + text[end:]


path = Path("index.html")
text = path.read_text(encoding="utf-8")

display_group_replacement = """      <div class=\"display-group\">
        <!-- Dark/Light Mode Toggle -->
        <button id=\"darkModeToggle\"
                type=\"button\"
                aria-label=\"Switch to Light Mode\"
                data-action=\"toggle-dark-mode\"
                data-mode=\"dark\"
                data-tippy-content=\"Switch between light mode and dark mode.\">
          <svg class=\"icon icon-moon\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z\" fill=\"currentColor\" />
          </svg>
          <svg class=\"icon icon-sun\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"currentColor\" />
            <path d=\"M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M8.34 17.66 6.93 19.07m0-14.14 1.41 1.41m9.32 9.32 1.41 1.41\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" />
          </svg>
        </button>

        <!-- Theme Toggle Button -->
        <button id=\"themeToggle\"
                type=\"button\"
                class=\"themeToggle\"
                aria-label=\"Themes\"
                data-action=\"toggle-theme-panel\"
                data-tippy-content=\"Open or close the Theme Selector.\">
          <svg class=\"icon icon-palette\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M12 3a9 9 0 00-9 9c0 4.97 4.03 9 9 9h.5a2.5 2.5 0 002.5-2.5 2.5 2.5 0 00-2.5-2.5h-1a2 2 0 110-4h4a3 3 0 003-3 6 6 0 00-6-6zm-4.5 9a1.5 1.5 0 111.5-1.5A1.5 1.5 0 017.5 12zm3-3a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0110.5 9zm5 0a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0115.5 9zm2 3a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0117.5 12z\" fill=\"currentColor\" />
          </svg>
        </button>

        <!-- Settings (new button) -->
        <button id=\"settingsBtn\"
                type=\"button\"
                aria-label=\"Settings\"
                data-action=\"open-settings\"
                data-tippy-content=\"ToDo: Open Settings.\">
          <svg class=\"icon icon-gear\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M19.14 12.94a7.2 7.2 0 000-1.88l2.03-1.58-1.5-2.6-2.39.78a6.1 6.1 0 00-1.62-.94L15.5 3h-3l-.16 2.72a6.1 6.1 0 00-1.62.94l-2.39-.78-1.5 2.6 2.03 1.58a6.1 6.1 0 000 1.88l-2.03 1.58 1.5 2.6 2.39-.78a6.1 6.1 0 001.62.94L12.5 21h3l.16-2.72a6.1 6.1 0 001.62-.94l2.39.78 1.5-2.6zm-7.14.56a2.5 2.5 0 112.5-2.5 2.5 2.5 0 01-2.5 2.5z\" fill=\"currentColor\" />
          </svg>
        </button>
      </div>
"""

text = replace_section(text, "      <div class=\"display-group\">", "      <!-- Upper Controls -->", display_group_replacement)

upper_controls_replacement = """      <!-- Upper Controls -->
      <div class=\"upper-controls\">
        <!-- Start Button -->
        <button id=\"startBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"toggle-timer\"
                data-state=\"start\"
                aria-label=\"Start\"
                data-tippy-content=\"Start or pause the timer!\">
          <svg class=\"icon icon-play\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M8 5v14l11-7z\" fill=\"currentColor\" />
          </svg>
          <svg class=\"icon icon-pause\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\" fill=\"currentColor\" />
          </svg>
        </button>

        <!-- Pause Button (initially hidden) -->
        <button id=\"pauseBtn\"
                type=\"button\"
                class=\"control-btn hidden\"
                data-action=\"pause\"
                aria-label=\"Pause\"
                data-tippy-content=\"Pause the timer.\">
          <svg class=\"icon icon-pause\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\" fill=\"currentColor\" />
          </svg>
        </button>
  
        <!-- Reset Button -->
        <button id=\"resetBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"reset\"
                aria-label=\"Reset\"
                data-tippy-content=\"Reset the timer and session.\">
          <svg class=\"icon icon-reset\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z\" fill=\"currentColor\" />
          </svg>
        </button>
      </div>

"""

text = replace_section(text, "      <!-- Upper Controls -->", "      <!-- Timer Section -->", upper_controls_replacement)

lower_controls_replacement = """      <!-- Lower Controls -->
      <div class=\"lower-controls\">
        <!-- Session Info -->
        <button id=\"sessionBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"session\"
                aria-label=\"Session Details\"
                data-tippy-content=\"ToDo: View or edit session details.\">
          <svg class=\"icon icon-session\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" />
            <path d=\"M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z\" fill=\"currentColor\" />
          </svg>
        </button>

        <!-- Log Button -->
        <button id=\"logBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"log\"
                aria-label=\"Log Moment\"
                data-tippy-content=\"Log a moment or effect.\">
          <svg class=\"icon icon-log\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z\" fill=\"currentColor\" />
          </svg>
        </button>

        <!-- High Idea Button -->
        <button id=\"highIdeaBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"high-idea\"
                aria-label=\"High Idea\"
                data-tippy-content=\"Record a 'high idea' or insight.\">
          <svg class=\"icon icon-idea\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z\" fill=\"currentColor\" />
          </svg>
        </button>

        <!-- Distract Me Button -->
        <button id=\"distractMeBtn\"
                type=\"button\"
                class=\"control-btn\"
                data-action=\"distract\"
                aria-label=\"Distract Me\"
                data-tippy-content=\"DistractMe!\">
          <svg class=\"icon icon-distract\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
            <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z\" fill=\"currentColor\" />
          </svg>
        </button>
      </div>

"""

text = replace_section(text, "      <!-- Lower Controls -->", "    </div>\n\n    <!-- Skin Selector Section -->", lower_controls_replacement)

effects_replacement = """          <input type=\"text\" id=\"momentInput\" list=\"effectsList\" 
                 placeholder=\"Custom moment or scroll down for options\">
          <datalist id=\"effectsList\">
            <option value=\"Mellow Relaxation\"></option>
            <option value=\"Euphoric Giddiness\"></option>
            <option value=\"Creative Spark\"></option>
            <option value=\"Heightened Focus\"></option>
            <option value=\"Mindful Reflection\"></option>
            <option value=\"Sensory Boost\"></option>
            <option value=\"Cozy Couch-Lock\"></option>
            <option value=\"Uplifting Energy\"></option>
            <option value=\"Taste Explorer (Munchies)\"></option>
            <option value=\"Tranquil Sleepiness\"></option>
            <option value=\"Nervous Heart Palpitations\"></option>
            <option value=\"Waves of Panic\"></option>
            <option value=\"Paranoid Thoughts\"></option>
            <option value=\"Indescribable Sparkly Stillness\"></option>
          </datalist>
"""

text = replace_section(text, "          <input type=\"text\" id=\"momentInput\"", "          </datalist>", effects_replacement, include_end=True)

share_replacement = """    <!-- Share Button -->
    <button id=\"shareBtn\"
            type=\"button\"
            class=\"control-btn\"
            data-action=\"share\"
            aria-label=\"Share\"
            data-tippy-content=\"Share your session details.\">
      <svg class=\"icon icon-share\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" focusable=\"false\">
        <path d=\"M18 16.08a3 3 0 10-2.82 4 3 3 0 002.82-4zm-8.91-2.38l7.05-4.09a3 3 0 10-.82-1.78l-7.05 4.09a3 3 0 100 3.56l7.05 4.09a3 3 0 10.82-1.78z\" fill=\"currentColor\" />
      </svg>
    </button>

"""

text = replace_section(text, "    <!-- Share Button -->", "    <!-- Share Modal -->", share_replacement)

path.write_text(text, encoding="utf-8")