/* Minimal interactive behaviour for Omia Player site:
 * - accessible mobile navigation drawer
 * - four-media-types tab switcher with Lumen artwork glow
 * - before/after cover & tag lookup preview toggle
 * - live Lumen & Stage theme + accent swatch preview
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

  // Before/After cover & tag lookup preview
  const tagfix = document.querySelector("[data-tagfix]");
  if (tagfix) {
    const tfButtons = Array.from(tagfix.querySelectorAll("[data-tagfix-mode]"));
    const tfBadge = tagfix.querySelector("[data-tagfix-badge]");
    tfButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const state = btn.getAttribute("data-tagfix-mode");
        tagfix.setAttribute("data-state", state);
        tfButtons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        if (tfBadge) {
          tfBadge.textContent = state === "before" ? "3 messy files" : "3 matches ready";
        }
      });
    });
  }

  // Live Lumen & Stage theme + accent preview
  const preview = document.querySelector("[data-lumen-preview]");
  const styleButtons = Array.from(document.querySelectorAll("[data-preview-style]"));
  const swatches = Array.from(document.querySelectorAll("[data-preview-accent]"));
  const statusEl = document.querySelector("[data-preview-status]");
  const dotEl = document.querySelector("[data-preview-dot]");

  if (preview) {
    let activeStyleLabel = "Lumen dark";
    let activeAccentLabel = "Orange";

    const updateStatus = () => {
      if (statusEl) {
        statusEl.textContent = `${activeStyleLabel} · ${activeAccentLabel}`;
      }
    };

    styleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const styleId = btn.getAttribute("data-preview-style");
        activeStyleLabel = btn.textContent.trim();
        preview.setAttribute("data-style", styleId);
        styleButtons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
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
        if (dotEl) {
          dotEl.style.background = hex;
        }
        swatches.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        updateStatus();
      });
    });
  }
})();
