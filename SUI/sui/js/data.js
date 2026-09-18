/* ==========================================================================
   SUI: shared demo state
   One record (PS-JH-10482) moves through 12 stages. Every page reads and
   writes the same localStorage record, so an action taken as Government
   is immediately visible as Citizen / University / Industry on next load.
   This is CONCEPTUAL PLATFORM DATA for a hackathon prototype, not a real
   government dataset.
   ========================================================================== */
(function (global) {
  const KEY = "sui_state_v3";

  const STAGES = [
    { id: 0,  code: "SUBMITTED",   label: "Reported",              owner: "citizen" },
    { id: 1,  code: "VERIFIED",    label: "Govt. verified",        owner: "government" },
    { id: 2,  code: "COMPETING",   label: "Universities competing",owner: "university" },
    { id: 3,  code: "EVALUATED",   label: "Solutions evaluated",   owner: "university" },
    { id: 4,  code: "SELECTED",    label: "Solution selected",     owner: "university" },
    { id: 5,  code: "VALIDATED",   label: "Solution validated",    owner: "university" },
    { id: 6,  code: "FUNDED",      label: "Industry funded",       owner: "industry" },
    { id: 7,  code: "PILOT",       label: "Pilot underway",        owner: "university" },
    { id: 8,  code: "GOV_REVIEW",  label: "Govt. reviewing pilot", owner: "government" },
    { id: 9,  code: "CERTIFIED",   label: "Impact certified",      owner: "government" },
    { id: 10, code: "DEPLOYED",    label: "Deployed",              owner: "government" },
    { id: 11, code: "CLOSED",      label: "Citizen validated",     owner: "citizen" },
  ];

  const UNI_NAMES = ["NIT Jamshedpur", "BIT Mesra (Ranchi)", "IIT (ISM) Dhanbad"];
  const WINNER = "BIT Mesra (Ranchi)";

  function emptyState() {
    return {
      version: 3,
      stage: -1,
      problem: null,
      universities: [],
      selectedUniversity: null,
      funding: null,
      pilot: null,
      certification: null,
      deployment: null,
      citizenValidation: null,
      log: [],
      notifications: { citizen: [], university: [], industry: [], government: [] },
      lastRole: null,
    };
  }

  function nowISO() { return new Date().toISOString(); }

  function daysAgo(n, hour, min) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
  }

  function fmtDate(iso) {
    if (!iso) return "Not set";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function timeAgo(iso) {
    if (!iso) return "Not set";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    return d + "d ago";
  }

  /* Rich, pre-filled walkthrough. Loads by default so every dashboard shows
     real content immediately. Stage 5 (VALIDATED): reported, verified, all
     three universities competed and were scored, BIT Mesra (Ranchi)
     selected and technically validated. Funding through citizen
     confirmation are still open, so every role has a real next action. */
  function exampleState() {
    const reportedAt = daysAgo(6, 9, 14);
    const verifiedAt = daysAgo(5, 11, 40);
    const enroll1 = daysAgo(5, 15, 0);
    const enroll2 = daysAgo(5, 15, 10);
    const enroll3 = daysAgo(5, 15, 20);
    const submittedAt = daysAgo(3, 18, 20);
    const selectedAt = daysAgo(2, 10, 5);
    const validatedAt = daysAgo(1, 16, 45);

    const s = emptyState();
    s.stage = 5;
    s.problem = {
      id: "PS-JH-10482",
      title: "Persistent road pothole on Kanke Road",
      category: "Urban Infrastructure",
      district: "Ranchi, Jharkhand",
      severity: "High",
      description: "A large, deepening pothole on the main carriageway near the Kanke Road junction is causing traffic slowdowns and a rising number of two wheeler accidents, especially after monsoon rain pools inside it.",
      citizenName: "Meera Oraon",
      submitterType: "Citizen",
      reportedAt: reportedAt,
      priority: "High",
      aiNote: "Pattern matches three prior monsoon season road surface reports filed in this ward. Recommend prioritizing before the next rainfall.",
      verifiedAt: verifiedAt,
    };
    s.universities = [
      { name: "NIT Jamshedpur", status: "not-selected", feasibility: 74, cost: 68, impact: 71, scalability: 66, total: 70, enrolledAt: enroll2, submittedAt: submittedAt },
      { name: "BIT Mesra (Ranchi)", status: "selected", feasibility: 91, cost: 82, impact: 89, scalability: 85, total: 87, enrolledAt: enroll1, submittedAt: submittedAt },
      { name: "IIT (ISM) Dhanbad", status: "not-selected", feasibility: 80, cost: 60, impact: 77, scalability: 73, total: 73, enrolledAt: enroll3, submittedAt: submittedAt },
    ];
    s.selectedUniversity = "BIT Mesra (Ranchi)";
    s.log = [
      { ts: validatedAt, actor: "university", text: "BIT Mesra (Ranchi) completed technical validation and opened the project for industry collaboration." },
      { ts: selectedAt, actor: "university", text: "BIT Mesra (Ranchi) selected as the winning solution after evaluation." },
      { ts: submittedAt, actor: "university", text: "All three universities submitted solutions for evaluation." },
      { ts: enroll3, actor: "university", text: "IIT (ISM) Dhanbad enrolled to compete on Persistent road pothole on Kanke Road." },
      { ts: enroll2, actor: "university", text: "NIT Jamshedpur enrolled to compete on Persistent road pothole on Kanke Road." },
      { ts: enroll1, actor: "university", text: "BIT Mesra (Ranchi) enrolled to compete on Persistent road pothole on Kanke Road." },
      { ts: verifiedAt, actor: "government", text: "Verified the report and published it as an official challenge, priority High." },
      { ts: reportedAt, actor: "citizen", text: "Reported \u201cPersistent road pothole on Kanke Road\u201d with photo evidence and GPS location." },
    ];
    s.notifications = {
      citizen: [
        { ts: selectedAt, text: "A university has been selected to build a solution for your report.", kind: "info", read: false },
        { ts: verifiedAt, text: "Your problem has been verified by the government and is now open for universities to solve.", kind: "success", read: true },
        { ts: reportedAt, text: "Your report PS-JH-10482 was submitted and is awaiting human verification.", kind: "info", read: true },
      ],
      government: [
        { ts: submittedAt, text: "3 solutions submitted for PS-JH-10482, ready for evaluation.", kind: "info", read: false },
        { ts: enroll3, text: "IIT (ISM) Dhanbad enrolled to compete on PS-JH-10482", kind: "info", read: true },
        { ts: enroll2, text: "NIT Jamshedpur enrolled to compete on PS-JH-10482", kind: "info", read: true },
        { ts: enroll1, text: "BIT Mesra (Ranchi) enrolled to compete on PS-JH-10482", kind: "info", read: true },
        { ts: reportedAt, text: "New citizen report awaiting verification: Persistent road pothole on Kanke Road", kind: "pending", read: true },
      ],
      university: [
        { ts: selectedAt, text: "BIT Mesra (Ranchi) has been selected to develop the solution for PS-JH-10482", kind: "success", read: false },
        { ts: verifiedAt, text: "New verified challenge published: Persistent road pothole on Kanke Road (Ranchi, Jharkhand)", kind: "pending", read: true },
      ],
      industry: [
        { ts: validatedAt, text: "BIT Mesra (Ranchi)'s solution is validated and seeking CSR, technology, and mentorship support.", kind: "pending", read: false },
        { ts: selectedAt, text: "A validated challenge (PS-JH-10482) will soon need acceleration support.", kind: "info", read: true },
      ],
    };
    return s;
  }

  const SUI = {
    STAGES, UNI_NAMES, WINNER,
    PROBLEM_ID: "PS-JH-10482",
    _state: null,

    load() {
      if (this._state) return this._state;
      try {
        const raw = localStorage.getItem(KEY);
        this._state = raw ? JSON.parse(raw) : exampleState();
        if (!this._state.version || this._state.version < 3) this._state = exampleState();
      } catch (e) {
        this._state = exampleState();
      }
      return this._state;
    },

    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this._state)); } catch (e) {}
    },

    reset() { this._state = exampleState(); this.save(); },
    resetEmpty() { this._state = emptyState(); this.save(); },

    log(actor, text) {
      const s = this.load();
      s.log.unshift({ ts: nowISO(), actor, text });
      this.save();
    },

    notify(role, text, kind) {
      const s = this.load();
      s.notifications[role].unshift({ ts: nowISO(), text, kind: kind || "info", read: false });
      this.save();
    },

    unreadCount(role) {
      const s = this.load();
      return (s.notifications[role] || []).filter((n) => !n.read).length;
    },

    markAllRead(role) {
      const s = this.load();
      (s.notifications[role] || []).forEach((n) => { n.read = true; });
      this.save();
    },

    stage() { return this.load().stage; },
    stageInfo(idOverride) {
      const id = idOverride === undefined ? this.stage() : idOverride;
      return STAGES.find((s) => s.id === id) || null;
    },
    isAtLeast(stageId) { return this.stage() >= stageId; },
    setRole(role) { const s = this.load(); s.lastRole = role; this.save(); },

    submitProblem(form) {
      const s = this.load();
      s.problem = Object.assign({
        id: this.PROBLEM_ID,
        category: "Urban Infrastructure",
        district: "Ranchi, Jharkhand",
        submitterType: "Citizen",
        reportedAt: nowISO(),
        citizenName: form.citizenName || "Citizen Reporter",
      }, form);
      s.stage = 0;
      s.log = [];
      this.save();
      this.log("citizen", "Reported \u201c" + s.problem.title + "\u201d with photo evidence and GPS location.");
      this.notify("government", "New citizen report awaiting verification: " + s.problem.title, "pending");
      this.notify("citizen", "Your report " + this.PROBLEM_ID + " was submitted and is awaiting human verification.", "info");
    },

    verifyProblem({ priority, aiNote }) {
      const s = this.load();
      s.problem.priority = priority || "High";
      s.problem.aiNote = aiNote || "";
      s.problem.verifiedAt = nowISO();
      s.stage = 1;
      this.save();
      this.log("government", "Verified the report and published it as an official challenge, priority " + s.problem.priority + ".");
      this.notify("citizen", "Your problem has been verified by the government and is now open for universities to solve.", "success");
      this.notify("university", "New verified challenge published: " + s.problem.title + " (" + s.problem.district + ")", "pending");
    },

    rejectProblem(reason) {
      const s = this.load();
      s.stage = -2;
      s.problem.rejectionReason = reason;
      this.save();
      this.log("government", "Report sent back for more information: " + reason);
      this.notify("citizen", "Your report needs more information: " + reason, "warning");
    },

    enrollUniversity(name) {
      const s = this.load();
      if (s.universities.find((u) => u.name === name)) return;
      s.universities.push({ name, status: "building", enrolledAt: nowISO() });
      if (s.stage < 2) s.stage = 2;
      this.save();
      this.log("university", name + " enrolled to compete on " + (s.problem ? s.problem.title : "the challenge") + ".");
      this.notify("government", name + " enrolled to compete on " + this.PROBLEM_ID, "info");
    },

    submitAllSolutions() {
      const s = this.load();
      const scored = [
        { name: "NIT Jamshedpur", feasibility: 74, cost: 68, impact: 71, scalability: 66 },
        { name: "BIT Mesra (Ranchi)", feasibility: 91, cost: 82, impact: 89, scalability: 85 },
        { name: "IIT (ISM) Dhanbad", feasibility: 80, cost: 60, impact: 77, scalability: 73 },
      ];
      s.universities = scored.map((u) => {
        const total = Math.round((u.feasibility + u.cost + u.impact + u.scalability) / 4);
        return Object.assign({ status: "submitted", submittedAt: nowISO(), total }, u);
      });
      s.stage = 3;
      this.save();
      this.log("university", "All three universities submitted solutions for evaluation.");
      this.notify("government", "3 solutions submitted for " + this.PROBLEM_ID + ", ready for evaluation.", "info");
    },

    selectUniversity(name) {
      const s = this.load();
      s.selectedUniversity = name;
      s.universities = s.universities.map((u) => Object.assign({}, u, { status: u.name === name ? "selected" : "not-selected" }));
      s.stage = 4;
      this.save();
      this.log("university", name + " selected as the winning solution after evaluation.");
      this.notify("university", name + " has been selected to develop the solution for " + this.PROBLEM_ID, "success");
      this.notify("citizen", "A university has been selected to build a solution for your report.", "info");
      this.notify("industry", "A validated challenge (" + this.PROBLEM_ID + ") will soon need acceleration support.", "info");
    },

    validateSolution() {
      const s = this.load();
      s.stage = 5;
      this.save();
      this.log("university", s.selectedUniversity + " completed technical validation and opened the project for industry collaboration.");
      this.notify("industry", s.selectedUniversity + "'s solution is validated and seeking CSR, technology, and mentorship support.", "pending");
    },

    commitFunding({ partner, types, amount }) {
      const s = this.load();
      s.funding = { partner, types, amount, committedAt: nowISO() };
      s.stage = 6;
      this.save();
      this.log("industry", partner + " committed " + amount + " and " + types.join(", ") + " support to the project.");
      this.notify("university", partner + " committed funding and support to your project.", "success");
      this.notify("citizen", "An industry partner has funded the solution to your problem.", "info");
      this.notify("government", partner + " confirmed CSR support for " + this.PROBLEM_ID, "info");
    },

    startPilot() {
      const s = this.load();
      s.pilot = { startedAt: nowISO() };
      s.stage = 7;
      this.save();
      this.log("university", "Pilot deployment started at the reported location.");
      this.notify("citizen", "A pilot fix has started at your reported location.", "info");
      this.notify("government", "Pilot started for " + this.PROBLEM_ID + ". Evidence will be submitted for review.", "info");
    },

    submitPilotForReview(evidenceNote) {
      const s = this.load();
      s.pilot.evidenceNote = evidenceNote;
      s.pilot.submittedAt = nowISO();
      s.stage = 8;
      this.save();
      this.log("university", "Submitted pilot performance evidence for government review.");
      this.notify("government", "Pilot evidence submitted for " + this.PROBLEM_ID + ", ready for review.", "pending");
    },

    certify(level) {
      const s = this.load();
      s.certification = { level: level || "Level 5: Impact Certified", issuedAt: nowISO() };
      s.stage = 9;
      this.save();
      this.log("government", "Issued government impact certification after reviewing pilot performance.");
      this.notify("university", "Your project received Government Impact Certification.", "success");
      this.notify("industry", "The project you funded has been certified by the government.", "success");
    },

    deploySolution() {
      const s = this.load();
      s.deployment = { deployedAt: nowISO() };
      s.stage = 10;
      this.save();
      this.log("government", "Marked the solution as deployed in the community.");
      this.notify("citizen", "Your problem has been solved. Please confirm the outcome.", "pending");
    },

    citizenValidate(confirmed, feedback) {
      const s = this.load();
      s.citizenValidation = { confirmed, feedback: feedback || "", at: nowISO() };
      s.stage = confirmed ? 11 : 10;
      this.save();
      this.log("citizen", confirmed ? "Confirmed the problem is resolved and closed the loop." : "Flagged the fix as incomplete.");
      if (confirmed) {
        this.notify("government", "Citizen confirmed the problem is resolved. Impact loop closed for " + this.PROBLEM_ID, "success");
        this.notify("university", "Citizen confirmed your solution resolved the reported problem.", "success");
      }
    },

    rankings() {
      const s = this.load();
      const base = [
        { name: "NIT Jamshedpur", score: 78, projects: 4, districts: 3 },
        { name: "BIT Mesra (Ranchi)", score: 81, projects: 5, districts: 4 },
        { name: "IIT (ISM) Dhanbad", score: 84, projects: 6, districts: 5 },
        { name: "Xavier Institute (Ranchi)", score: 71, projects: 3, districts: 2 },
      ];
      if (s.stage >= 9) {
        base.find((u) => u.name === "BIT Mesra (Ranchi)").score = 96;
        base.find((u) => u.name === "BIT Mesra (Ranchi)").projects += 1;
      } else if (s.stage >= 4) {
        base.find((u) => u.name === "BIT Mesra (Ranchi)").score = 87;
      }
      return base.sort((a, b) => b.score - a.score);
    },

    otherChallenges() {
      return [
        { id: "PS-JH-10310", title: "Groundwater depletion in Gumla irrigation belt", domain: "Agriculture & Water", district: "Gumla, Jharkhand", status: "Competing", unis: 2 },
        { id: "PS-JH-10221", title: "Female literacy gap in Latehar block schools", domain: "Education", district: "Latehar, Jharkhand", status: "Open", unis: 0 },
        { id: "PS-JH-10198", title: "Tribal healthcare access in Khunti hill villages", domain: "Healthcare", district: "Khunti, Jharkhand", status: "Evaluating", unis: 3 },
        { id: "PS-JH-10077", title: "Unsafe seasonal migration corridors", domain: "Migration", district: "Sahibganj, Jharkhand", status: "Pilot", unis: 1 },
      ];
    },

    stageProgressPct() {
      const s = this.stage();
      if (s < 0) return 0;
      return Math.round(((s + 1) / STAGES.length) * 100);
    },

    fmtDate, timeAgo,
  };

  global.SUI = SUI;
})(window);
