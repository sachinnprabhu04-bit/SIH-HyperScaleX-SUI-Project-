/* ==========================================================================
   SUI effects: native reimplementations of a few interaction techniques
   (canvas particle reveal, magnetic hover, momentum-scroll snapping,
   command palette, workspace-style switcher) adapted to this site's own
   palette and subject matter. No external animation library.
   ========================================================================== */
(function (global) {

  /* ------------------------------------------------------------------------
     Thread reveal: a canvas needle-and-thread stitches itself across the
     hero, left to right, in a gentle wave. Each stitch is a short dash;
     consecutive stitches connect with a thin thread. This is the one bold,
     hand-built hero moment, grounded in सूई (needle) as the literal brand
     mark, not a generic particle field.
     ------------------------------------------------------------------------ */
  function initThreadReveal(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    let stitches = [];
    let startTime = null;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPath();
    }

    function buildPath() {
      stitches = [];
      const count = Math.max(14, Math.round(w / 46));
      const amp = h * 0.16;
      const midY = h * 0.52;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = t * w;
        const y = midY + Math.sin(t * Math.PI * 2.1) * amp + Math.sin(t * Math.PI * 5.3) * (amp * 0.18);
        stitches.push({ x, y, delay: i * 55 });
      }
    }

    function draw(ts) {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(189,90,42,0.55)";
      ctx.lineWidth = 1.6;
      for (let i = 0; i < stitches.length - 1; i++) {
        const a = stitches[i], b = stitches[i + 1];
        const segStart = a.delay + 90;
        if (elapsed < segStart) continue;
        const p = Math.min(1, (elapsed - segStart) / 260);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
        ctx.stroke();
      }

      stitches.forEach((s) => {
        if (elapsed < s.delay) return;
        const p = Math.min(1, (elapsed - s.delay) / 220);
        const r = 3.4 * p;
        ctx.fillStyle = "rgba(75,94,54," + (0.85 * p) + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      const totalDur = stitches.length ? stitches[stitches.length - 1].delay + 400 : 0;
      if (elapsed < totalDur + 600 && !reduceMotion) {
        requestAnimationFrame(draw);
      } else if (reduceMotion) {
        stitches.forEach((s) => {
          ctx.fillStyle = "rgba(75,94,54,0.85)";
          ctx.beginPath(); ctx.arc(s.x, s.y, 3.4, 0, Math.PI * 2); ctx.fill();
        });
      }
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
  }
  global.initThreadReveal = initThreadReveal;

  /* ------------------------------------------------------------------------
     Magnetic hover: element gently follows the cursor within its own
     bounds, springs back on leave. Reserved for a small number of hero
     and footer call-to-actions, not applied sitewide.
     ------------------------------------------------------------------------ */
  function initMagnetic(selector) {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("magnetic");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("pointerleave", () => { el.style.transform = "translate(0,0)"; });
    });
  }
  global.initMagnetic = initMagnetic;

  /* ------------------------------------------------------------------------
     Momentum scroller: a horizontal row of cards that flicks with real
     velocity and settles on the nearest card, on wheel, drag, and touch.
     Used once, for the stakeholder benefit showcase on the homepage.
     ------------------------------------------------------------------------ */
  function initMomentumScroller(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const viewport = track.parentElement;
    let velocity = 0;
    let isDown = false;
    let startX = 0, startScroll = 0, lastX = 0, lastT = 0;
    let raf = null;

    function step() {
      if (!isDown && Math.abs(velocity) > 0.15) {
        viewport.scrollLeft += velocity;
        velocity *= 0.92;
        raf = requestAnimationFrame(step);
      } else if (!isDown) {
        snap();
      }
    }

    function cardWidth() {
      const first = track.children[0];
      return first ? first.getBoundingClientRect().width + 18 : 300;
    }

    function snap() {
      const cw = cardWidth();
      const target = Math.round(viewport.scrollLeft / cw) * cw;
      viewport.scrollTo({ left: target, behavior: "smooth" });
    }

    viewport.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        velocity += e.deltaY * 0.5;
        velocity = Math.max(-40, Math.min(40, velocity));
        if (!raf) raf = requestAnimationFrame(function loop() { step(); raf = null; });
      }
    }, { passive: false });

    viewport.addEventListener("pointerdown", (e) => {
      isDown = true; startX = e.clientX; startScroll = viewport.scrollLeft; lastX = e.clientX; lastT = performance.now();
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      viewport.scrollLeft = startScroll - dx;
      const t = performance.now();
      const dt = Math.max(1, t - lastT);
      velocity = -((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX; lastT = t;
    });
    const release = () => {
      if (!isDown) return;
      isDown = false;
      if (!raf) raf = requestAnimationFrame(function loop() { step(); raf = null; });
    };
    viewport.addEventListener("pointerup", release);
    viewport.addEventListener("pointercancel", release);
    viewport.addEventListener("pointerleave", () => { if (isDown) release(); });
  }
  global.initMomentumScroller = initMomentumScroller;

  /* ------------------------------------------------------------------------
     Command palette: Ctrl/Cmd+K quick jump to any page. Genuinely
     functional, not decorative, so it applies globally.
     ------------------------------------------------------------------------ */
  function initCommandPalette(pages, rootPrefix) {
    let overlay = document.getElementById("cmdkOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "cmdk-overlay";
      overlay.id = "cmdkOverlay";
      overlay.innerHTML =
        '<div class="cmdk-box">' +
          '<div class="cmdk-input-row">' + suiIcon("search") + '<input class="cmdk-input" id="cmdkInput" placeholder="Jump to a page or portal" /></div>' +
          '<div class="cmdk-results" id="cmdkResults"></div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    const input = overlay.querySelector("#cmdkInput");
    const results = overlay.querySelector("#cmdkResults");

    function render(query) {
      const q = (query || "").toLowerCase();
      const matches = pages.filter((p) => !q || p.label.toLowerCase().includes(q) || p.group.toLowerCase().includes(q));
      if (!matches.length) {
        results.innerHTML = '<div class="cmdk-empty">No matching page</div>';
        return;
      }
      results.innerHTML = matches.map((p, i) => (
        '<a class="cmdk-item' + (i === 0 ? " sel" : "") + '" href="' + rootPrefix + p.href + '">' +
          '<span class="cmdk-item-icon" style="background:' + p.color + ';">' + suiIcon(p.icon) + '</span>' +
          '<span><span class="cmdk-item-title">' + p.label + '</span><br><span class="cmdk-item-sub">' + p.group + '</span></span>' +
        '</a>'
      )).join("");
    }

    function open() {
      overlay.classList.add("open");
      input.value = "";
      render("");
      setTimeout(() => input.focus(), 30);
    }
    function close() { overlay.classList.remove("open"); }

    input.addEventListener("input", () => render(input.value));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      if (e.key === "Escape") close();
    });
    document.querySelectorAll("[data-cmdk-open]").forEach((btn) => btn.addEventListener("click", open));
  }
  global.initCommandPalette = initCommandPalette;

  /* ------------------------------------------------------------------------
     Role switcher dropdown, replacing the old plain "switch role" link.
     ------------------------------------------------------------------------ */
  function initRoleSwitcher(roles, currentRole, rootPrefix) {
    const el = document.getElementById("roleSwitcher");
    if (!el) return;
    const current = roles.find((r) => r.id === currentRole) || roles[0];
    el.innerHTML =
      '<button class="role-switcher-trigger" id="roleSwitcherBtn" type="button">' +
        '<span class="role-switcher-icon" style="background:' + current.color + ';">' + suiIcon(current.icon) + '</span>' +
        '<span>' + current.label + '</span>' +
        '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="role-switcher-menu">' +
        roles.map((r) => (
          '<a class="role-switcher-item' + (r.id === currentRole ? " current" : "") + '" href="' + rootPrefix + r.href + '">' +
            '<span class="rsi-icon" style="background:' + r.color + ';">' + suiIcon(r.icon) + '</span>' + r.label +
          '</a>'
        )).join("") +
      '</div>';
    const btn = el.querySelector("#roleSwitcherBtn");
    btn.addEventListener("click", (e) => { e.stopPropagation(); el.classList.toggle("open"); });
    document.addEventListener("click", () => el.classList.remove("open"));
  }
  global.initRoleSwitcher = initRoleSwitcher;

})(window);
