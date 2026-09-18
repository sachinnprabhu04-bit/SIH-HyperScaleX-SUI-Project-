/* ==========================================================================
   SUI: shared UI behaviour used on every page
   ========================================================================== */
(function (global) {

  const ICONS = {
    dashboard: '<path d="M4 4h7v7H4z"/><path d="M13 4h7v4h-7z"/><path d="M13 11h7v9h-7z"/><path d="M4 14h7v6H4z"/>',
    flag: '<path d="M5 3v18"/><path d="M5 4h11l-2 4 2 4H5"/>',
    list: '<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M4.5 6h.01"/><path d="M4.5 12h.01"/><path d="M4.5 18h.01"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    map: '<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L16 9.8"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15.3 14.3c2.7.4 4.7 2.4 4.7 5.7"/>',
    briefcase: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
    university: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/><path d="M21 9v6"/>',
    factory: '<path d="M3 21V11l5 3v-3l5 3V8l6-4v17H3z"/><path d="M8 17h9"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>',
    barchart: '<path d="M5 20V10"/><path d="M12 20V4"/><path d="M19 20v-7"/>',
    piechart: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l7.2 3.7"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    upload: '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    camera: '<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/>',
    phone: '<path d="M6.5 3.5c1 0 2.4 2.3 2.4 3.2s-1.4 1.7-1.4 2.6c0 1.8 3.2 5 5 5 .9 0 1.7-1.4 2.6-1.4.9 0 3.2 1.4 3.2 2.4 0 1.4-1.6 3.2-3 3.2C10.8 18.5 5.5 13.2 5.5 8.7c0-1.4 1.8-3 3-3.2z" fill="currentColor" stroke="none"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    award: '<circle cx="12" cy="8" r="5.2"/><path d="M9 12.5L7.5 20l4.5-2.3L16.5 20 15 12.5"/>',
    trending: '<path d="M4 16l6-6 4 4 6-8"/><path d="M15 6h5v5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    alert: '<path d="M12 3.5l9.5 16.5H2.5L12 3.5z"/><path d="M12 10v4"/><path d="M12 17.2h.01"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>',
    download: '<path d="M12 4v12"/><path d="M7 12l5 5 5-5"/><path d="M4 20h16"/>',
    arrow: '<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
    switch: '<path d="M7 4l-3.5 3.5L7 11"/><path d="M3.5 7.5H14a5 5 0 0 1 5 5v1"/><path d="M17 20l3.5-3.5L17 13"/><path d="M20.5 16.5H10a5 5 0 0 1-5-5v-1"/>',
    thread: '<path d="M4 18c3-1 4-4 3-6.5S4.5 8 6 5.5C7.3 3.4 10 3 12 5c1.6 1.6 1 3.7-.5 4.8"/><circle cx="12" cy="4.4" r="1.6"/>',
    building: '<path d="M5 21V6l7-3 7 3v15"/><path d="M9 21v-6h6v6"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 14h.01"/><path d="M15 14h.01"/>',
    handshake: '<path d="M2 12l4-3 4 2 3-2 3 2 3-2 3 3"/><path d="M8 11l3 4"/><path d="M14 11l-2 5-3 1"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  };

  function icon(name, cls) {
    const body = ICONS[name] || ICONS.dashboard;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || '') + '">' + body + '</svg>';
  }
  global.suiIcon = icon;

  function animateCountUp(el) {
    const target = parseFloat(el.getAttribute("data-countup"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 900, start = performance.now();
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  global.animateCountUp = animateCountUp;

  function rootPath() {
    const depth = (document.body.getAttribute("data-depth") || "0");
    return "../".repeat(parseInt(depth, 10));
  }
  global.suiRoot = rootPath;

  document.addEventListener("DOMContentLoaded", function () {
    SUI.load();

    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle && sidebar) {
      toggle.innerHTML = icon("menu");
      toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
      document.addEventListener("click", (e) => {
        if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
          sidebar.classList.remove("open");
        }
      });
    }

    document.querySelectorAll("[data-reset-demo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Reload the pre-filled example? This restores PS-JH-10482 to its populated walkthrough state for everyone.")) {
          SUI.reset();
          toast("Example data reloaded.", "info");
          setTimeout(() => { window.location.href = rootPath() + "index.html"; }, 700);
        }
      });
    });
    document.querySelectorAll("[data-reset-blank]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Clear everything and start from a blank slate? Use this to demo the full lifecycle from a real citizen submission.")) {
          SUI.resetEmpty();
          toast("Cleared. Starting from an empty record.", "info");
          setTimeout(() => { window.location.href = rootPath() + "index.html"; }, 700);
        }
      });
    });

    document.body.addEventListener("click", (e) => {
      const card = e.target.closest("[data-info-card]");
      if (!card) return;
      openInfoModal(card.getAttribute("data-info-title") || "Reference item", card.getAttribute("data-info-body") || "");
    });
    document.body.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest("[data-info-card]");
      if (!card) return;
      e.preventDefault();
      card.click();
    });

    const revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("revealed"); io.unobserve(entry.target); }
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 55 + "ms"; io.observe(el); });
      } else {
        revealEls.forEach((el) => el.classList.add("revealed"));
      }
    }

    document.querySelectorAll("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-open-modal");
        const el = document.getElementById(id);
        if (el) el.classList.add("open");
        if (id === "notifPanelOverlay") {
          const role = btn.getAttribute("data-notif-role");
          renderNotifList(role);
          SUI.markAllRead(role);
          const dot = btn.querySelector(".dot");
          if (dot) dot.style.display = "none";
        }
      });
    });
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => btn.closest(".overlay").classList.remove("open"));
    });
    document.querySelectorAll(".overlay").forEach((ov) => {
      ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("open"); });
    });

    document.querySelectorAll("[data-countup]").forEach((el) => animateCountUp(el));
    document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icon(el.getAttribute("data-icon")) + el.innerHTML; });

    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const tabs = group.querySelectorAll(".tab");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const target = tab.getAttribute("data-tab-target");
          group.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
          group.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
          tab.classList.add("active");
          const panel = document.getElementById(target);
          if (panel) panel.classList.add("active");
        });
      });
    });

    initCallWidget();
  });

  function toast(message, kind) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = icon(kind === "success" ? "check" : kind === "warning" ? "alert" : "bell") + "<span>" + message + "</span>";
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(20px)"; el.style.transition = "all .3s ease"; setTimeout(() => el.remove(), 320); }, 3600);
  }
  global.toast = toast;

  function renderNotifList(role) {
    const target = document.querySelector('[data-notif-list="' + role + '"]');
    if (!target) return;
    const items = SUI.load().notifications[role] || [];
    if (!items.length) {
      target.innerHTML = '<div class="empty-state" style="padding:30px 10px;">' + icon("bell") + '<h3 style="font-size:.95rem;">No notifications yet</h3><p style="font-size:.8rem;">Updates about ' + SUI.PROBLEM_ID + ' will appear here as the project moves forward.</p></div>';
      return;
    }
    target.innerHTML = items.map((n) => (
      '<div class="row gap-sm" style="align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line);">' +
      '<span style="width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0;background:' + (n.kind === "success" ? "var(--green)" : n.kind === "warning" ? "var(--danger)" : n.kind === "pending" ? "var(--gold)" : "var(--navy)") + ';"></span>' +
      '<div><div style="font-size:.85rem;color:var(--ink);">' + n.text + '</div><div style="font-size:.7rem;color:var(--ink-faint);margin-top:3px;" class="mono">' + SUI.timeAgo(n.ts) + '</div></div></div>'
    )).join("");
  }
  global.renderNotifList = renderNotifList;

  function ensureInfoModal() {
    let ov = document.getElementById("infoModalOverlay");
    if (ov) return ov;
    ov = document.createElement("div");
    ov.className = "overlay";
    ov.id = "infoModalOverlay";
    ov.innerHTML =
      '<div class="modal" style="max-width:440px;">' +
        '<button class="modal-close" data-close-modal>' + icon("close") + '</button>' +
        '<div class="eyebrow">Reference data</div>' +
        '<h3 id="infoModalTitle" style="margin-bottom:10px;"></h3>' +
        '<div id="infoModalBody" style="font-size:.88rem;color:var(--ink-soft);line-height:1.6;"></div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector("[data-close-modal]").addEventListener("click", () => ov.classList.remove("open"));
    ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("open"); });
    return ov;
  }
  function openInfoModal(title, bodyHtml) {
    const ov = ensureInfoModal();
    ov.querySelector("#infoModalTitle").textContent = title;
    ov.querySelector("#infoModalBody").innerHTML = bodyHtml;
    ov.classList.add("open");
  }
  global.openInfoModal = openInfoModal;

  function renderProgressRing(containerId, pct, label) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const r = 48, c = 2 * Math.PI * r;
    const offset = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
    el.innerHTML =
      '<svg viewBox="0 0 108 108" class="progress-ring">' +
        '<circle cx="54" cy="54" r="' + r + '" class="ring-track"></circle>' +
        '<circle cx="54" cy="54" r="' + r + '" class="ring-fill" style="stroke-dasharray:' + c + ';stroke-dashoffset:' + c + ';"></circle>' +
      '</svg>' +
      '<div class="ring-center"><span data-countup="' + pct + '" data-suffix="%">0%</span>' + (label ? '<small>' + label + '</small>' : '') + '</div>';
    const fillCircle = el.querySelector(".ring-fill");
    requestAnimationFrame(() => requestAnimationFrame(() => { fillCircle.style.strokeDashoffset = offset; }));
    const countEl = el.querySelector("[data-countup]");
    if (countEl) animateCountUp(countEl);
  }
  global.renderProgressRing = renderProgressRing;

  const CALL_URL = "https://agent.retellai.com/orb/agent_296d1db81db39a09df24634822?token=bffeec99bbca4242c489aff9c2b82531";
  global.SUI_CALL_URL = CALL_URL;

  function initCallWidget() {
    const mount = document.querySelector("[data-call-widget]");
    if (!mount) return;
    mount.innerHTML =
      '<button class="call-fab" id="suiCallFab" style="position:relative;">' +
        '<span class="fab-ring"></span>' + icon("phone") +
        '<span>' + (mount.getAttribute("data-call-label") || "SUI Sahayak") + '</span>' +
      '</button>' +
      '<div class="overlay" id="suiCallOverlay">' +
        '<div class="modal modal-wide">' +
          '<button class="modal-close" data-close-modal>' + icon("close") + '</button>' +
          '<div class="eyebrow">Voice reporting, Hindi</div>' +
          '<h3>SUI Sahayak</h3>' +
          '<p style="margin-bottom:16px;">Speak to SUI\u2019s Hindi voice assistant to report a problem hands free, or ask about a report already filed.</p>' +
          '<div id="suiOrbHolder" style="border:1.5px solid var(--line-strong);border-radius:var(--radius-md);overflow:hidden;height:420px;background:var(--paper-raised);display:flex;align-items:center;justify-content:center;">' +
            '<iframe id="suiOrbFrame" src="" title="SUI Sahayak voice agent" allow="microphone" style="width:100%;height:100%;border:0;display:none;"></iframe>' +
            '<div id="suiOrbFallback" style="text-align:center;padding:24px;">' +
              '<div style="width:34px;height:34px;color:var(--green);margin:0 auto 12px;">' + icon("phone") + '</div>' +
              '<p style="margin-bottom:16px;">This voice agent opens best in its own tab on mobile.</p>' +
              '<a class="btn btn-primary" id="suiOrbOpenNew" target="_blank" rel="noopener">Open SUI Sahayak</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    const fab = document.getElementById("suiCallFab");
    const overlay = document.getElementById("suiCallOverlay");
    const frame = document.getElementById("suiOrbFrame");
    const openNew = document.getElementById("suiOrbOpenNew");
    if (openNew) openNew.href = CALL_URL;
    fab.addEventListener("click", () => {
      overlay.classList.add("open");
      if (frame && !frame.src) {
        frame.src = CALL_URL;
        frame.style.display = "block";
        const fb = document.getElementById("suiOrbFallback");
        if (fb) fb.style.display = "none";
        frame.addEventListener("error", () => { frame.style.display = "none"; if (fb) fb.style.display = "block"; });
      }
    });
    overlay.querySelector("[data-close-modal]").addEventListener("click", () => overlay.classList.remove("open"));
  }

  const MILESTONES = [
    { label: "Reported", upto: 0 },
    { label: "Verified", upto: 1 },
    { label: "University competition", upto: 3 },
    { label: "Solution selected", upto: 5 },
    { label: "Industry funded", upto: 6 },
    { label: "Pilot", upto: 8 },
    { label: "Certified", upto: 9 },
    { label: "Deployed, closed", upto: 11 },
  ];
  global.SUI_MILESTONES = MILESTONES;

  function renderStepper(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const stage = SUI.stage();
    let currentIdx = MILESTONES.findIndex((m) => stage <= m.upto);
    if (stage < 0) currentIdx = -1;
    if (currentIdx === -1 && stage >= 0) currentIdx = MILESTONES.length - 1;
    el.innerHTML = MILESTONES.map((m, i) => {
      let cls = "step";
      if (i < currentIdx) cls += " done";
      else if (i === currentIdx) cls += " current";
      return '<div class="' + cls + '"><div class="step-node">' + (i < currentIdx ? "\u2713" : (i + 1)) + '</div><div class="step-label">' + m.label + '</div></div>';
    }).join("");
  }
  global.renderStepper = renderStepper;

})(window);
