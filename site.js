/* Minimal interactive behaviour for Omia Player site:
 * - accessible mobile navigation drawer
 * - four-media-types tab switcher with Lumen artwork glow
 * - live Lumen style & accent swatch preview
 */

(() => {
  // Mobile menu toggle
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu();
      } else {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // Four media types tabs (click-only, keyboard arrow navigation)
  const mediaSection = document.querySelector("[data-media-section]");
  const tabs = Array.from(document.querySelectorAll("[data-media-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-media-panel]"));

  if (tabs.length && panels.length) {
    const activate = (tab, moveFocus) => {
      const target = tab.getAttribute("data-media-tab");
      const glow = tab.getAttribute("data-glow");
      const accent = tab.getAttribute("data-accent");

      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panels.forEach((p) => {
        const match = p.getAttribute("data-media-panel") === target;
        p.classList.toggle("is-active", match);
        p.hidden = !match;
      });

      if (mediaSection && glow) {
        mediaSection.style.setProperty("--media-glow", glow);
      }
      if (accent) {
        tab.style.setProperty("--tab-accent", accent);
      }
      if (moveFocus) {
        tab.focus();
      }
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => activate(tab, false));
      tab.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          activate(tabs[(idx + 1) % tabs.length], true);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          activate(tabs[(idx - 1 + tabs.length) % tabs.length], true);
        }
      });
    });
  }

  // Live Lumen theme & accent preview
  const preview = document.querySelector("[data-lumen-preview]");
  const modeButtons = Array.from(document.querySelectorAll("[data-preview-mode]"));
  const swatches = Array.from(document.querySelectorAll("[data-preview-accent]"));
  const statusEl = document.querySelector("[data-preview-status]");

  if (preview) {
    let activeModeLabel = "Lumen dark";
    let activeAccentLabel = "Orange";

    const updateStatus = () => {
      if (statusEl) {
        statusEl.textContent = `${activeModeLabel} · ${activeAccentLabel}`;
      }
    };

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-preview-mode");
        activeModeLabel = btn.textContent.trim();
        preview.setAttribute("data-mode", mode);
        modeButtons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        updateStatus();
      });
    });

    swatches.forEach((btn) => {
      btn.addEventListener("click", () => {
        const hex = btn.getAttribute("data-preview-accent");
        const ink = btn.getAttribute("data-preview-ink") || "#15120f";
        activeAccentLabel = btn.getAttribute("aria-label") || "Accent";
        preview.style.setProperty("--pv-accent", hex);
        preview.style.setProperty("--pv-accent-ink", ink);
        swatches.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        updateStatus();
      });
    });
  }
})();
