/**
 * Theme switcher: sets data-theme, persists to localStorage,
 * updates the sliding thumb, and uses View Transitions when available.
 */
(function () {
  const STORAGE_KEY = "portfolio-theme";
  const THEMES = ["classy", "playful", "cozy"];

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore quota / private mode */
    }
  }

  function themeIndex(theme) {
    const index = THEMES.indexOf(theme);
    return index === -1 ? 0 : index;
  }

  function applyTheme(theme, { animate } = { animate: true }) {
    const next = THEMES.includes(theme) && theme !== "cozy" ? theme : "classy";
    const root = document.documentElement;

    const run = () => {
      root.dataset.theme = next;
      root.style.setProperty("--switcher-thumb-index", String(themeIndex(next)));
      storeTheme(next);
      document.title =
        (next === "playful" ? "Playful" : "Classy") + " — Alissa";

      document
        .querySelectorAll('.theme-switcher input[name="theme"]')
        .forEach((input) => {
          input.checked = input.value === next;
        });
    };

    if (
      animate &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.startViewTransition(run);
    } else {
      run();
    }
  }

  function init() {
    const stored = getStoredTheme();
    const initial =
      stored && stored !== "cozy" && THEMES.includes(stored) ? stored : "classy";

    applyTheme(initial, { animate: false });

    document.querySelectorAll(".theme-switcher").forEach((fieldset) => {
      fieldset.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.name !== "theme" || target.disabled) return;
        applyTheme(target.value, { animate: true });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
