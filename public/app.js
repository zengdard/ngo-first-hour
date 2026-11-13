/* 9:14 — The First Hour
   Simulation-first, bilingual (EN/FR), phone-first. No questionnaire, no backend. */

const $ = (sel, root = document) => root.querySelector(sel);

const esc = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

let lang = localStorage.getItem("ngogame.lang");
if (!lang || !CONTENT[lang]) {
  lang = navigator.language && navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

const c = () => CONTENT[lang];

const state = {
  scenarioId: null,
  mode: "player",
  screen: "inbox",
  ransomAction: null,
  laptopAction: null,
  containActions: [],
  contacts: [],
  log: { name: "", time: "", description: "", affected: "" },
  message: "",
  logResult: null,
  desk: {
    modal: null,
    doc: null,
    done: [],
    flags: {},
    path: [],
    error: null,
  },
};

const DESK_ACTIONS = {
  open_mail: { points: 10, flag: "mail", label: "mail" },
  open_email: { points: 10, flag: "email", label: "openEmail" },
  report_email: { points: 10, flag: "reported", label: "reportIt" },
  click_link: { points: -15, flag: "clicked", label: "openInvoice" },
  delete_email: { points: -5, flag: "deleted", label: "deleteIt" },
  disconnect: { points: 10, flag: "disconnect", label: "containDisconnect" },
  pay_ransom: { points: -20, flag: "pay", label: "ransomPay" },
  restart: { points: -10, flag: "restart", label: "ransomRestart" },
  call_it: { points: 10, flag: "call_it", label: "contactIT" },
  call_circl: { points: 10, flag: "call_circl", label: "contactCIRCL" },
  call_cnpd: { points: 5, flag: "call_cnpd", label: "contactCNPD" },
  call_bank: { points: 5, flag: "call_bank", label: "contactBank" },
  call_police: { points: 5, flag: "call_police", label: "contactPolice" },
  log: { points: 20, flag: "log", label: "saveLog" },
  message: { points: 20, flag: "message", label: "sendMessage" },
  false_message: { points: -10, flag: "false_message", label: "falseMessage" },
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

let routeKey = null;

/* ---------- Routing ---------- */

function readRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };
  if (parts[0] === "demo") return { name: "demo" };
  if (parts[0] === "group") return { name: "group" };
  if (parts[0] === "log") return { name: "log" };
  if (parts[0] === "presenter" && parts[1]) {
    return { name: "scenario", mode: "presenter", id: parts[1] };
  }
  if ((parts[0] === "phishing" || parts[0] === "laptop") && parts.length === 1) {
    return { name: "scenario", mode: "player", id: parts[0] };
  }
  return { name: "home" };
}

function navigate(path = "") {
  const target = path ? `#/${path}` : "#/";
  if (location.hash === target) {
    render();
    return;
  }
  location.hash = target;
}

/* ---------- State ---------- */

function resetScenario(id, mode) {
  state.scenarioId = id;
  state.mode = mode;
  state.screen = id === "phishing" ? "desk" : "device";
  state.ransomAction = null;
  state.laptopAction = null;
  state.containActions = [];
  state.contacts = [];
  state.log = { name: "", time: "", description: "", affected: "" };
  state.message = "";
  state.logResult = null;
  state.desk = { modal: null, doc: null, done: [], flags: {}, path: [], error: null };
}

function resetLog() {
  state.log = { name: "", time: "", description: "", affected: "" };
  state.logResult = null;
}

/* ---------- Chrome ---------- */

function syncChrome() {
  const ui = c().ui;
  document.documentElement.lang = lang;
  const map = {
    "#brand-sub": ui.brandSubtitle,
    "#nav-home": ui.navHome,
    "#nav-group": ui.navGroup,
    "#nav-individual": ui.navIndividual,
    "#footer-text": ui.footer,
  };
  Object.entries(map).forEach(([selector, text]) => {
    const el = $(selector);
    if (el) el.textContent = text;
  });
  document.querySelectorAll(".lang button").forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

/* ---------- Shared UI ---------- */

function cueBlock(key) {
  if (state.mode !== "presenter") return "";
  const sim = c().sim;
  if (!sim[key]) return "";
  return `<div class="cue"><strong>${sim.presenterCue}</strong> ${esc(sim[key])}</div>`;
}

function modeBadge() {
  const sim = c().sim;
  return `<span class="badge ${state.mode === "presenter" ? "presenter" : ""}">${
    state.mode === "presenter" ? sim.presenter : sim.player
  }</span>`;
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function logFields(prefix) {
  const ui = c().ui;
  return `
    <div class="form-grid">
      <div class="field">
        <label for="${prefix}-name">${ui.nameLabel} <span class="hint">${ui.nameHint}</span></label>
        <input id="${prefix}-name" type="text" maxlength="120" value="${esc(state.log.name)}"
          placeholder="${esc(ui.namePlaceholder)}" />
      </div>
      <div class="field">
        <label for="${prefix}-time">${ui.timeLabel} <span class="hint">${ui.timeHint}</span></label>
        <input id="${prefix}-time" type="text" maxlength="80" value="${esc(state.log.time)}"
          placeholder="${esc(ui.timePlaceholder)}" />
      </div>
      <div class="field">
        <label for="${prefix}-description">${ui.descriptionLabel} <span class="hint">${ui.descriptionHint}</span></label>
        <textarea id="${prefix}-description" maxlength="1200"
          placeholder="${esc(ui.descriptionPlaceholder)}">${esc(state.log.description)}</textarea>
      </div>
      <div class="field">
        <label for="${prefix}-affected">${ui.affectedLabel} <span class="hint">${ui.affectedHint}</span></label>
        <input id="${prefix}-affected" type="text" maxlength="200" value="${esc(state.log.affected)}"
          placeholder="${esc(ui.affectedPlaceholder)}" />
      </div>
    </div>
  `;
}

function readLog(prefix) {
  return {
    name: $(`#${prefix}-name`)?.value || "",
    time: $(`#${prefix}-time`)?.value || "",
    description: $(`#${prefix}-description`)?.value || "",
    affected: $(`#${prefix}-affected`)?.value || "",
  };
}

/* ---------- Home and demo ---------- */

function homeView() {
  const ui = c().ui;
  const sim = c().sim;
  const phishing = c().scenarios.phishing;
  const laptop = c().scenarios.laptop;

  return `
    <section class="hero">
      <p class="eyebrow">${ui.homeEyebrow}</p>
      <h1>${ui.homeTitle}</h1>
      <p class="lede">${ui.homeLede}</p>
      <p class="core">${ui.homeCore}</p>
    </section>

    <div class="grid">
      <article class="card">
        <span class="tag">${sim.phishing}</span>
        <h2>${esc(phishing.title)}</h2>
        <p>${esc(phishing.subtitle)}</p>
        <div class="btn-row">
          <button class="primary" data-action="go" data-path="presenter/phishing">${sim.presenter}</button>
          <button class="secondary" data-action="go" data-path="phishing">${sim.player}</button>
        </div>
      </article>

      <article class="card">
        <span class="tag">${sim.laptop}</span>
        <h2>${esc(laptop.title)}</h2>
        <p>${esc(laptop.subtitle)}</p>
        <div class="btn-row">
          <button class="primary" data-action="go" data-path="presenter/laptop">${sim.presenter}</button>
          <button class="secondary" data-action="go" data-path="laptop">${sim.player}</button>
        </div>
      </article>

      <article class="card">
        <span class="tag warn">${sim.log}</span>
        <h2>${ui.individualTitle}</h2>
        <p>${ui.individualText}</p>
        <div class="btn-row">
          <button class="primary" data-action="go" data-path="log">${sim.start}</button>
        </div>
      </article>
    </div>

    <div class="btn-row">
      <button class="ghost" data-action="go" data-path="demo">${sim.demoTitle}</button>
    </div>
  `;
}

function groupView() {
  const sim = c().sim;
  const phishing = c().scenarios.phishing;
  const laptop = c().scenarios.laptop;
  return `
    <p class="eyebrow">${c().ui.groupSelectEyebrow}</p>
    <h1>${c().ui.groupSelectTitle}</h1>
    <p class="lede">${c().ui.groupSelectLede}</p>

    <div class="grid">
      <article class="card">
        <span class="tag">${sim.phishing}</span>
        <h2>${esc(phishing.title)}</h2>
        <p>${esc(phishing.subtitle)}</p>
        <div class="btn-row">
          <button class="primary" data-action="go" data-path="presenter/phishing">${sim.presenter}</button>
          <button class="secondary" data-action="go" data-path="phishing">${sim.player}</button>
        </div>
      </article>
      <article class="card">
        <span class="tag">${sim.laptop}</span>
        <h2>${esc(laptop.title)}</h2>
        <p>${esc(laptop.subtitle)}</p>
        <div class="btn-row">
          <button class="primary" data-action="go" data-path="presenter/laptop">${sim.presenter}</button>
          <button class="secondary" data-action="go" data-path="laptop">${sim.player}</button>
        </div>
      </article>
    </div>

    <div class="btn-row">
      <button class="ghost" data-action="go" data-path="">${c().ui.backHome}</button>
    </div>
  `;
}

function demoView() {
  const sim = c().sim;
  const base = location.origin + location.pathname;
  const rows = [
    ["phishing", `${sim.phishing} — ${sim.player}`],
    ["presenter/phishing", `${sim.phishing} — ${sim.presenter}`],
    ["laptop", `${sim.laptop} — ${sim.player}`],
    ["presenter/laptop", `${sim.laptop} — ${sim.presenter}`],
    ["log", sim.log],
  ];

  return `
    <p class="eyebrow">${sim.demoTitle}</p>
    <h1>${sim.demoTitle}</h1>
    <p class="lede">${sim.demoText}</p>

    <div class="demo-list">
      ${rows
        .map(([path, label]) => {
          const url = `${base}#/${path}`;
          return `
            <div class="demo-row">
              <div class="demo-meta">
                <strong>${esc(label)}</strong>
                <code class="demo-url">${esc(url)}</code>
              </div>
              <button class="secondary copy-btn" data-action="copy" data-copy="${esc(url)}">${sim.copy}</button>
            </div>
          `;
        })
        .join("")}
    </div>

    <div class="btn-row">
      <button class="ghost" data-action="go" data-path="">${sim.backHome}</button>
    </div>
  `;
}

/* ---------- Scenario A ---------- */

function inboxView() {
  const sim = c().sim;
  const ctx = c().scenarios.phishing.context;
  return `
    ${cueBlock("cueInbox")}
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.mail}</span>
        <span class="app-sub">${sim.inbox}</span>
      </div>
      <div class="search-bar">${sim.search}</div>
      <div class="mail-list">
        <button class="mail-row unread" data-action="open-email">
          <span class="avatar">BL</span>
          <span class="mail-row-text">
            <strong>${esc(ctx.from)}</strong>
            <span>${esc(ctx.subject)}</span>
            <span class="preview">${esc(ctx.body.slice(0, 64))}…</span>
          </span>
          <span class="mail-time">09:14</span>
        </button>
        <div class="mail-row">
          <span class="avatar soft">NL</span>
          <span class="mail-row-text">
            <strong>${esc(sim.newsletter)}</strong>
            <span>${esc(sim.newsletterSubject)}</span>
            <span class="preview">Our monthly update…</span>
          </span>
          <span class="mail-time">08:02</span>
        </div>
        <div class="mail-row">
          <span class="avatar soft">JD</span>
          <span class="mail-row-text">
            <strong>${esc(sim.colleagueName)}</strong>
            <span>${esc(sim.colleagueSubject)}</span>
            <span class="preview">Thanks, I will send the file…</span>
          </span>
          <span class="mail-time">Yesterday</span>
        </div>
      </div>
    </div>
    <p class="hint">${sim.tapEmail}</p>
  `;
}

function emailView() {
  const sim = c().sim;
  const ctx = c().scenarios.phishing.context;
  return `
    ${cueBlock("cueEmail")}
    <div class="phone-app">
      <div class="app-bar">
        <button class="icon-btn" data-action="screen" data-screen="inbox" aria-label="Back">‹</button>
        <span class="app-title">${sim.mail}</span>
      </div>
      <div class="mail-detail-head">
        <span class="avatar">BL</span>
        <div>
          <strong>${esc(ctx.from)}</strong>
          <span>to me</span>
        </div>
      </div>
      <h3>${esc(ctx.subject)}</h3>
      <p>${esc(ctx.body)}</p>
      <p class="mail-link">${esc(ctx.link)}</p>
      <span class="attachment">${esc(ctx.attachment)}</span>
      <div class="action-row">
        <button class="primary" data-action="email-open">${sim.openInvoice}</button>
        <button class="secondary" data-action="email-report">${sim.reportIt}</button>
        <button class="ghost" data-action="email-delete">${sim.deleteIt}</button>
      </div>
    </div>
  `;
}

function fakeLoginView() {
  const sim = c().sim;
  return `
    ${cueBlock("cueFakeLogin")}
    <div class="fake-login">
      <div class="fake-login-card">
        <p class="eyebrow">${sim.simulation || c().ui.simulation} · Banque de Luxembourg</p>
        <h3>${c().ui.fakeLoginTitle}</h3>
        <label>${c().ui.fakeLoginId}</label>
        <input type="text" value="client@ngo.example" disabled />
        <label>${c().ui.fakeLoginPassword}</label>
        <input type="text" value="••••••••" disabled />
        <button class="primary" type="button" disabled>${c().ui.fakeLoginButton}</button>
        <p class="notice" style="margin-top:.9rem">${c().ui.fakeLoginNotice}</p>
      </div>
    </div>
    <button class="primary" data-action="to-ransom">${sim.continue}</button>
  `;
}

function reportedView() {
  const sim = c().sim;
  return `
    <div class="feedback good">
      <strong>${sim.reportedTitle}</strong>
      <p>${sim.reportedBody}</p>
    </div>
    <button class="primary" data-action="to-contain">${sim.continue}</button>
  `;
}

function deletedView() {
  const sim = c().sim;
  return `
    <div class="feedback partial">
      <strong>${sim.deletedTitle}</strong>
      <p>${sim.deletedBody}</p>
    </div>
    <button class="primary" data-action="to-contain">${sim.continue}</button>
  `;
}

function ransomView() {
  const sim = c().sim;
  return `
    ${cueBlock("cueRansom")}
    <div class="ransom-screen">
      <div class="ransom-card">
        <p class="eyebrow">⚠ ${sim.ransomTitle}</p>
        <h2>${sim.ransomTitle}</h2>
        <p>${sim.ransomBody}</p>
        <div class="action-row">
          <button class="primary danger" data-action="ransom" data-value="pay">${sim.ransomPay}</button>
          <button class="secondary" data-action="ransom" data-value="disconnect">${sim.ransomDisconnect}</button>
          <button class="ghost" data-action="ransom" data-value="restart">${sim.ransomRestart}</button>
        </div>
      </div>
    </div>
  `;
}

function ransomResultView() {
  const sim = c().sim;
  const map = {
    pay: { text: sim.ransomPaid, cls: "bad" },
    disconnect: { text: sim.ransomContained, cls: "good" },
    restart: { text: sim.ransomRestarted, cls: "partial" },
  };
  const result = map[state.ransomAction] || map.pay;
  return `
    <div class="feedback ${result.cls}">
      <strong>${state.ransomAction === "disconnect" ? sim.ransomDisconnect : state.ransomAction === "pay" ? sim.ransomPay : sim.ransomRestart}</strong>
      <p>${result.text}</p>
    </div>
    <button class="primary" data-action="to-contain">${sim.continue}</button>
  `;
}

function containView() {
  const sim = c().sim;
  const options = [
    ["disconnect", sim.containDisconnect],
    ["passwords", sim.containPasswords],
    ["call", sim.containCall],
  ];
  return `
    ${cueBlock("cueContain")}
    <h1>${sim.containTitle}</h1>
    <p class="lede">${sim.containBody}</p>
    <div class="check-list">
      ${options
        .map(
          ([value, label]) => `
            <button class="check ${state.containActions.includes(value) ? "on" : ""}"
              data-action="contain-toggle" data-value="${value}">
              <span class="check-box">${state.containActions.includes(value) ? "✓" : ""}</span>
              <span>${label}</span>
            </button>
          `
        )
        .join("")}
    </div>
    ${state.containActions.length === 3 ? `<div class="feedback good"><p>${sim.containDone}</p></div>` : ""}
    <button class="primary" data-action="to-contacts">${sim.continue}</button>
  `;
}

function contactsView() {
  const sim = c().sim;
  const contacts = [
    ["it", sim.contactIT, sim.contactITRole],
    ["circl", sim.contactCIRCL, sim.contactCIRCLRole],
    ["cnpd", sim.contactCNPD, sim.contactCNPDRole],
    ["bank", sim.contactBank, sim.contactBankRole],
    ["police", sim.contactPolice, sim.contactPoliceRole],
    ["provider", sim.contactProvider, sim.contactProviderRole],
  ];
  return `
    ${cueBlock("cueContacts")}
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.contactsTitle}</span>
        <span class="app-sub">${sim.contactsSubtitle}</span>
      </div>
      <div class="contact-list">
        ${contacts
          .map(([id, name, role]) => {
            const called = state.contacts.includes(id);
            return `
              <div class="contact-row">
                <div class="contact-info">
                  <span class="avatar soft">${initials(name)}</span>
                  <div><strong>${esc(name)}</strong><span>${esc(role)}</span></div>
                </div>
                <button class="${called ? "secondary" : "primary"}" data-action="call-contact" data-id="${id}">
                  ${called ? sim.called : sim.call}
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
    ${state.contacts.length ? `<div class="feedback good"><p>${sim.contactsDone}</p></div>` : ""}
    <button class="primary" data-action="to-log">${sim.continue}</button>
  `;
}

function logFormView() {
  const sim = c().sim;
  return `
    ${cueBlock("cueLog")}
    <h1>${sim.logTitle}</h1>
    <p class="lede">${sim.logSubtitle}</p>
    <form id="scenario-log-form" novalidate>
      ${logFields("scenario")}
      <button class="primary" type="submit">${sim.saveLog}</button>
    </form>
  `;
}

function messageView() {
  const sim = c().sim;
  return `
    ${cueBlock("cueMessage")}
    <div class="chat-app">
      <div class="app-bar">
        <span class="app-title">${sim.messageTitle}</span>
        <span class="app-sub">${sim.messageSubtitle}</span>
      </div>
      <div class="chat-bubble">${sim.messageSubtitle}</div>
      <textarea id="message-text" class="chat-input" maxlength="1200"
        placeholder="${esc(sim.messagePlaceholder)}">${esc(state.message)}</textarea>
      <div class="btn-row">
        <button class="secondary" data-action="message-template">${sim.template}</button>
        <button class="primary" data-action="send-message">${sim.sendMessage}</button>
      </div>
    </div>
  `;
}

function debriefView() {
  const sim = c().sim;
  const ui = c().ui;
  return `
    <h1>${sim.debriefTitle}</h1>
    <p class="lede">${sim.debriefBody}</p>

    <div class="log-sheet">
      <p class="eyebrow">${sim.logTitle}</p>
      <dl>
        <dt>${ui.nameLabel}</dt><dd>${esc(state.log.name) || "—"}</dd>
        <dt>${ui.timeLabel}</dt><dd>${esc(state.log.time) || "—"}</dd>
        <dt>${ui.descriptionLabel}</dt><dd>${esc(state.log.description) || "—"}</dd>
        <dt>${ui.affectedLabel}</dt><dd>${esc(state.log.affected) || "—"}</dd>
      </dl>
    </div>

    <div class="notice">
      <strong>${sim.messageTitle}</strong>
      <p>${esc(state.message) || "—"}</p>
    </div>

    <h2>${sim.takeawaysTitle}</h2>
    <ul class="summary-list">
      ${sim.takeaways.map((item) => `<li><span>${esc(item)}</span></li>`).join("")}
    </ul>

    <div class="btn-row">
      <button class="primary" data-action="replay">${sim.replay}</button>
      <button class="secondary" data-action="go" data-path="">${sim.backHome}</button>
    </div>
  `;
}

function deviceView() {
  const sim = c().sim;
  const ctx = c().scenarios.laptop.context;
  return `
    ${cueBlock("cueLaptop")}
    <div class="file-app">
      <div class="app-bar">
        <span class="app-title">Files</span>
        <span class="app-sub">${sim.laptopTitle}</span>
      </div>
      <p class="file-banner">${esc(sim.laptopBody)}</p>
      <div class="file-list">
        ${ctx.details
          .map(
            (item, index) => `
              <div class="file-row">
                <span class="file-icon">${index === 0 ? "📄" : index === 1 ? "📁" : "💻"}</span>
                <span>${esc(item)}</span>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="action-row">
        <button class="primary" data-action="laptop" data-value="wipe">${sim.laptopWipe}</button>
        <button class="secondary" data-action="laptop" data-value="passwords">${sim.laptopPasswords}</button>
        <button class="secondary" data-action="laptop" data-value="report">${sim.laptopReport}</button>
        <button class="ghost" data-action="laptop" data-value="wait">${sim.laptopWait}</button>
      </div>
    </div>
  `;
}

function laptopResultView() {
  const sim = c().sim;
  const wait = state.laptopAction === "wait";
  const label =
    state.laptopAction === "passwords"
      ? sim.laptopPasswords
      : state.laptopAction === "report"
      ? sim.laptopReport
      : state.laptopAction === "wait"
      ? sim.laptopWait
      : sim.laptopWipe;
  return `
    ${cueBlock("cueLaptopData")}
    <div class="feedback ${wait ? "bad" : "good"}">
      <strong>${label}</strong>
      <p>${wait ? sim.laptopWaitResult : sim.laptopDone}</p>
    </div>
    <button class="primary" data-action="to-contacts-laptop">${sim.continue}</button>
  `;
}


/* ---------- Challenge 3: point-and-click desk ---------- */

function has(id) {
  return state.desk.done.includes(id);
}

function doAction(id) {
  const action = DESK_ACTIONS[id];
  if (!action || has(id)) return false;
  state.desk.done.push(id);
  state.desk.flags[action.flag] = true;
  state.desk.path.push({
    id,
    label: c().sim[action.label] || id,
    points: action.points,
  });
  return true;
}

function computeScore() {
  const flags = state.desk.flags;
  const recognition = (flags.mail ? 10 : 0) + (flags.email ? 10 : 0);

  let contain = (flags.reported ? 10 : 0) + (flags.disconnect ? 10 : 0);
  if (flags.pay) contain -= 20;
  if (flags.restart) contain -= 10;
  contain = clamp(contain, 0, 20);

  let calls =
    (flags.call_it ? 10 : 0) +
    (flags.call_circl ? 10 : 0) +
    (flags.call_cnpd ? 5 : 0) +
    (flags.call_bank ? 5 : 0) +
    (flags.call_police ? 5 : 0);
  calls = clamp(calls, 0, 20);

  const record = flags.log ? 20 : 0;

  let communicate = flags.message ? 20 : 0;
  if (flags.false_message) communicate -= 10;
  communicate = clamp(communicate, 0, 20);

  let penalties = 0;
  if (flags.clicked) penalties -= 15;
  if (flags.deleted) penalties -= 5;

  const total = clamp(recognition + contain + calls + record + communicate + penalties, 0, 100);
  return { recognition, contain, calls, record, communicate, penalties, total };
}

function osIcon(target, icon, label) {
  return `
    <button class="os-icon" data-action="desk-open" data-target="${target}">
      <span class="os-glyph">${icon}</span>
      <span>${esc(label)}</span>
    </button>
  `;
}

function deskView() {
  const sim = c().sim;
  const score = computeScore();
  const steps = [
    [sim.recognition, score.recognition, 20, has("open_mail") && has("open_email")],
    [sim.contain, score.contain, 20, has("disconnect") || has("report_email")],
    [sim.calls, score.calls, 20, has("call_it") && has("call_circl")],
    [sim.record, score.record, 20, has("log")],
    [sim.communicate, score.communicate, 20, has("message")],
  ];

  return `
    ${cueBlock("cueDesk")}
    <p class="hint">${sim.deskHint}</p>

    <div class="desk">
      <div class="desk-wall">
        <span class="desk-clock">09:14</span>
        <span class="desk-poster">“If in doubt, report it.”</span>
      </div>
      <div class="desk-surface">
        <div class="laptop">
          <div class="laptop-screen">
            <div class="os-grid">
              ${osIcon("mail", "✉️", sim.mail)}
              ${osIcon("files", "📁", sim.files)}
              ${osIcon("notes", "📝", sim.notes)}
              ${osIcon("log", "📋", sim.incidentLog)}
              ${osIcon("messages", "💬", sim.messages)}
              <button class="os-icon" data-action="desk-action" data-id="disconnect">
                <span class="os-glyph">🔌</span>
                <span>${esc(sim.containDisconnect)}</span>
              </button>
            </div>
          </div>
          <div class="laptop-base"></div>
          <span class="desk-label">${sim.laptop}</span>
        </div>

        <button class="desk-paper" data-action="desk-open" data-target="beneficiaries">
          <span class="paper-icon">📄</span>
          <span>${sim.beneficiaries}</span>
        </button>
        <button class="desk-paper finance" data-action="desk-open" data-target="finance">
          <span class="paper-icon">📁</span>
          <span>${sim.finance}</span>
        </button>
        <button class="desk-phone" data-action="desk-open" data-target="phone">
          <span class="phone-glyph">📱</span>
          <span>${sim.phone}</span>
        </button>
        <button class="desk-sticky" data-action="desk-open" data-target="note">
          9:14<br />weird email
        </button>
        <button class="desk-log" data-action="desk-open" data-target="log">
          <span>📋</span>
          <span>${sim.incidentLog}</span>
        </button>
      </div>
    </div>

    <div class="desk-hud">
      <div class="desk-steps">
        ${steps
          .map(
            ([label, value, max, done]) =>
              `<span class="desk-step ${done ? "done" : ""}">${done ? "✓" : "○"} ${esc(label)} ${value}/${max}</span>`
          )
          .join("")}
      </div>
      <div class="desk-score">${sim.score}: <strong>${score.total}</strong></div>
      <button class="secondary" data-action="desk-open" data-target="debrief">${sim.control}</button>
    </div>

    ${state.desk.modal ? deskModalView() : ""}
  `;
}

function deskModalView() {
  const views = {
    mail: deskMailModal,
    email: deskEmailModal,
    fakeLogin: deskFakeLoginModal,
    reported: deskReportedModal,
    deleted: deskDeletedModal,
    ransom: deskRansomModal,
    ransomResult: deskRansomResultModal,
    contained: deskContainedModal,
    phone: deskPhoneModal,
    files: deskFilesModal,
    document: deskDocumentModal,
    note: deskNoteModal,
    notes: deskNoteModal,
    log: deskLogModal,
    message: deskMessageModal,
    messages: deskMessageModal,
    debrief: deskDebriefModal,
  };
  const view = views[state.desk.modal];
  if (!view) return "";
  return `
    <div class="desk-modal-backdrop" data-action="desk-close">
      <div class="desk-modal" role="dialog" aria-modal="true">
        <button class="desk-modal-close" data-action="desk-close" aria-label="${c().sim.close}">×</button>
        ${view()}
      </div>
    </div>
  `;
}

function deskMailModal() {
  const sim = c().sim;
  const ctx = c().scenarios.phishing.context;
  return `
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.mail}</span>
        <span class="app-sub">${sim.inbox}</span>
      </div>
      <div class="search-bar">${sim.search}</div>
      <div class="mail-list">
        <button class="mail-row unread" data-action="desk-action" data-id="open_email">
          <span class="avatar">BL</span>
          <span class="mail-row-text">
            <strong>${esc(ctx.from)}</strong>
            <span>${esc(ctx.subject)}</span>
            <span class="preview">${esc(ctx.body.slice(0, 64))}…</span>
          </span>
          <span class="mail-time">09:14</span>
        </button>
        <div class="mail-row">
          <span class="avatar soft">NL</span>
          <span class="mail-row-text">
            <strong>${esc(sim.newsletter)}</strong>
            <span>${esc(sim.newsletterSubject)}</span>
            <span class="preview">Our monthly update…</span>
          </span>
          <span class="mail-time">08:02</span>
        </div>
        <div class="mail-row">
          <span class="avatar soft">JD</span>
          <span class="mail-row-text">
            <strong>${esc(sim.colleagueName)}</strong>
            <span>${esc(sim.colleagueSubject)}</span>
            <span class="preview">Thanks, I will send the file…</span>
          </span>
          <span class="mail-time">Yesterday</span>
        </div>
      </div>
    </div>
  `;
}

function deskEmailModal() {
  const sim = c().sim;
  const ctx = c().scenarios.phishing.context;
  return `
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.mail}</span>
        <span class="app-sub">${sim.openEmail}</span>
      </div>
      <div class="mail-detail-head">
        <span class="avatar">BL</span>
        <div>
          <strong>${esc(ctx.from)}</strong>
          <span>to me</span>
        </div>
      </div>
      <h3>${esc(ctx.subject)}</h3>
      <p>${esc(ctx.body)}</p>
      <p class="mail-link">${esc(ctx.link)}</p>
      <span class="attachment">${esc(ctx.attachment)}</span>
      <div class="action-row">
        <button class="primary" data-action="desk-action" data-id="click_link">${sim.openInvoice}</button>
        <button class="secondary" data-action="desk-action" data-id="report_email">${sim.reportIt}</button>
        <button class="ghost" data-action="desk-action" data-id="delete_email">${sim.deleteIt}</button>
      </div>
    </div>
  `;
}

function deskFakeLoginModal() {
  const sim = c().sim;
  const ui = c().ui;
  return `
    <div class="fake-login">
      <div class="fake-login-card">
        <p class="eyebrow">${ui.simulation} · Banque de Luxembourg</p>
        <h3>${ui.fakeLoginTitle}</h3>
        <label>${ui.fakeLoginId}</label>
        <input type="text" value="client@ngo.example" disabled />
        <label>${ui.fakeLoginPassword}</label>
        <input type="text" value="••••••••" disabled />
        <button class="primary" type="button" disabled>${ui.fakeLoginButton}</button>
        <p class="notice" style="margin-top:.9rem">${ui.fakeLoginNotice}</p>
      </div>
    </div>
    <button class="primary" data-action="desk-open" data-target="ransom">${sim.continue}</button>
  `;
}

function deskReportedModal() {
  const sim = c().sim;
  return `
    <div class="feedback good">
      <strong>${sim.reportedTitle}</strong>
      <p>${sim.reportedBody}</p>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskDeletedModal() {
  const sim = c().sim;
  return `
    <div class="feedback partial">
      <strong>${sim.deletedTitle}</strong>
      <p>${sim.deletedBody}</p>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskRansomModal() {
  const sim = c().sim;
  return `
    <div class="ransom-screen">
      <div class="ransom-card">
        <p class="eyebrow">⚠ ${sim.ransomTitle}</p>
        <h2>${sim.ransomTitle}</h2>
        <p>${sim.ransomBody}</p>
        <div class="action-row">
          <button class="primary danger" data-action="desk-action" data-id="pay_ransom">${sim.ransomPay}</button>
          <button class="secondary" data-action="desk-action" data-id="disconnect">${sim.ransomDisconnect}</button>
          <button class="ghost" data-action="desk-action" data-id="restart">${sim.ransomRestart}</button>
        </div>
      </div>
    </div>
  `;
}

function deskRansomResultModal() {
  const sim = c().sim;
  const flags = state.desk.flags;
  const text = flags.pay ? sim.ransomPaid : flags.disconnect ? sim.ransomContained : sim.ransomRestarted;
  const cls = flags.disconnect ? "good" : "bad";
  return `
    <div class="feedback ${cls}">
      <strong>${flags.pay ? sim.ransomPay : flags.disconnect ? sim.ransomDisconnect : sim.ransomRestart}</strong>
      <p>${text}</p>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskContainedModal() {
  const sim = c().sim;
  return `
    <div class="feedback good">
      <strong>${sim.containDisconnect}</strong>
      <p>${sim.ransomContained}</p>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskPhoneModal() {
  const sim = c().sim;
  const contacts = [
    ["call_it", sim.contactIT, sim.contactITRole],
    ["call_circl", sim.contactCIRCL, sim.contactCIRCLRole],
    ["call_cnpd", sim.contactCNPD, sim.contactCNPDRole],
    ["call_bank", sim.contactBank, sim.contactBankRole],
    ["call_police", sim.contactPolice, sim.contactPoliceRole],
  ];
  return `
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.contactsTitle}</span>
        <span class="app-sub">${sim.contactsSubtitle}</span>
      </div>
      <div class="contact-list">
        ${contacts
          .map(([id, name, role]) => {
            const called = has(id);
            return `
              <div class="contact-row">
                <div class="contact-info">
                  <span class="avatar soft">${initials(name)}</span>
                  <div><strong>${esc(name)}</strong><span>${esc(role)}</span></div>
                </div>
                <button class="${called ? "secondary" : "primary"}" data-action="desk-action" data-id="${id}">
                  ${called ? sim.called : sim.call}
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskFilesModal() {
  const sim = c().sim;
  return `
    <div class="phone-app">
      <div class="app-bar">
        <span class="app-title">${sim.files}</span>
        <span class="app-sub">${sim.laptop}</span>
      </div>
      <div class="file-list">
        <button class="file-row" data-action="desk-open" data-target="document" data-doc="beneficiaries">
          <span class="file-icon">📄</span>
          <span>${sim.beneficiaries}</span>
        </button>
        <button class="file-row" data-action="desk-open" data-target="document" data-doc="finance">
          <span class="file-icon">📁</span>
          <span>${sim.finance}</span>
        </button>
      </div>
    </div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskDocumentModal() {
  const sim = c().sim;
  const doc = state.desk.doc;
  const title = doc === "finance" ? sim.finance : sim.beneficiaries;
  const text = doc === "finance" ? sim.docFinance : sim.docBeneficiaries;
  return `
    <p class="eyebrow">${sim.laptop}</p>
    <h2>${esc(title)}</h2>
    <p>${esc(text)}</p>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskNoteModal() {
  const sim = c().sim;
  return `
    <div class="desk-sticky large">${esc(sim.noteText)}</div>
    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function deskLogModal() {
  const sim = c().sim;
  return `
    <h2>${sim.logTitle}</h2>
    <p>${sim.logSubtitle}</p>
    ${state.desk.error === "log" ? `<div class="feedback partial"><p>${sim.logIncomplete}</p></div>` : ""}
    <form id="desk-log-form" novalidate>
      ${logFields("desk")}
      <button class="primary" type="submit">${sim.saveLog}</button>
    </form>
  `;
}

function deskMessageModal() {
  const sim = c().sim;
  return `
    <div class="chat-app">
      <div class="app-bar">
        <span class="app-title">${sim.messageTitle}</span>
        <span class="app-sub">${sim.messageSubtitle}</span>
      </div>
      <div class="chat-bubble">${sim.messageSubtitle}</div>
      ${state.desk.error === "message" ? `<div class="feedback partial" style="margin:0 1rem .8rem"><p>${sim.messageIncomplete}</p></div>` : ""}
      <textarea id="desk-message" class="chat-input" maxlength="1200" placeholder="${esc(sim.messagePlaceholder)}"></textarea>
      <div class="btn-row" style="padding:0 1rem 1rem">
        <button class="secondary" data-action="desk-message-template">${sim.template}</button>
        <button class="primary" data-action="desk-message-send" data-value="honest">${sim.sendMessage}</button>
        <button class="ghost" data-action="desk-message-send" data-value="false">${sim.falseMessage}</button>
      </div>
    </div>
  `;
}

function treeRow(label, points, taken) {
  return `
    <div class="tree-branch ${taken ? "taken" : ""}">
      <span>${esc(label)}</span>
      <span>${points > 0 ? "+" : ""}${points}</span>
    </div>
  `;
}

function deskDebriefModal() {
  const sim = c().sim;
  const score = computeScore();
  const categories = [
    [sim.recognition, score.recognition, 20],
    [sim.contain, score.contain, 20],
    [sim.calls, score.calls, 20],
    [sim.record, score.record, 20],
    [sim.communicate, score.communicate, 20],
  ];
  const correct = [
    ["report_email", sim.reportIt],
    ["disconnect", sim.containDisconnect],
    ["call_it", sim.contactIT],
    ["call_circl", sim.contactCIRCL],
    ["log", sim.saveLog],
    ["message", sim.sendMessage],
  ];

  return `
    <p class="eyebrow">${sim.control}</p>
    <p class="score-big">${score.total}<small> / 100</small></p>

    <ul class="summary-list">
      ${categories
        .map(
          ([label, value, max]) =>
            `<li><span>${esc(label)}</span><span class="pts">${value}/${max}</span></li>`
        )
        .join("")}
      <li><span>${sim.penalties}</span><span class="pts">${score.penalties}</span></li>
    </ul>

    <h3>${sim.correctPath}</h3>
    <ul class="summary-list">
      ${correct
        .map(
          ([id, label]) =>
            `<li><span>${has(id) ? "✓" : "○"} ${esc(label)}</span><span class="pts">${
              has(id) ? sim.done : sim.missed
            }</span></li>`
        )
        .join("")}
    </ul>

    <h3>${sim.treeTitle}</h3>
    <div class="tree">
      <div class="tree-root">${sim.mail}</div>
      ${treeRow(sim.openEmail, 10, has("open_email"))}
      ${treeRow(sim.reportIt, 10, has("report_email"))}
      ${treeRow(sim.openInvoice, -15, has("click_link"))}
      ${treeRow(sim.deleteIt, -5, has("delete_email"))}
      <div class="tree-root">${sim.ransomTitle}</div>
      ${treeRow(sim.containDisconnect, 10, has("disconnect"))}
      ${treeRow(sim.ransomPay, -20, has("pay_ransom"))}
      ${treeRow(sim.ransomRestart, -10, has("restart"))}
      <div class="tree-root">${sim.contactsTitle}</div>
      ${treeRow(sim.contactIT, 10, has("call_it"))}
      ${treeRow(sim.contactCIRCL, 10, has("call_circl"))}
      ${treeRow(sim.contactCNPD, 5, has("call_cnpd"))}
      ${treeRow(sim.contactBank, 5, has("call_bank"))}
      ${treeRow(sim.contactPolice, 5, has("call_police"))}
      <div class="tree-root">${sim.logTitle}</div>
      ${treeRow(sim.saveLog, 20, has("log"))}
      <div class="tree-root">${sim.messageTitle}</div>
      ${treeRow(sim.sendMessage, 20, has("message"))}
      ${treeRow(sim.falseMessage, -10, has("false_message"))}
    </div>

    <h3>${sim.path}</h3>
    <ul class="summary-list">
      ${
        state.desk.path.length
          ? state.desk.path
              .map(
                (item) =>
                  `<li><span>${esc(item.label)}</span><span class="pts">${
                    item.points > 0 ? "+" : ""
                  }${item.points}</span></li>`
              )
              .join("")
          : `<li><span>—</span><span class="pts">0</span></li>`
      }
    </ul>

    <button class="secondary" data-action="desk-close">${sim.close}</button>
  `;
}

function scenarioView() {
  const scenario = c().scenarios[state.scenarioId];
  const screens = {
    desk: deskView,
    inbox: inboxView,
    email: emailView,
    fakeLogin: fakeLoginView,
    reported: reportedView,
    deleted: deletedView,
    ransom: ransomView,
    ransomResult: ransomResultView,
    contain: containView,
    contacts: contactsView,
    log: logFormView,
    message: messageView,
    debrief: debriefView,
    device: deviceView,
    laptopResult: laptopResultView,
  };
  const view = screens[state.screen] || inboxView;

  return `
    <div class="meta">
      ${modeBadge()}
      <span>${esc(scenario.label)} · ${esc(scenario.title)}</span>
    </div>
    ${view()}
    <div class="btn-row">
      <button class="ghost" data-action="go" data-path="">${c().sim.backHome}</button>
    </div>
  `;
}

/* ---------- Challenge 4 ---------- */

function evaluateLog(data) {
  const issues = [];
  let score = 0;

  const name = data.name.trim();
  const time = data.time.trim();
  const description = data.description.trim();
  const affected = data.affected.trim();
  const desc = description.toLowerCase();
  const aff = affected.toLowerCase();

  const nameScore = name.length >= 2 ? 20 : 0;
  score += nameScore;
  if (!nameScore) issues.push({ field: "name", key: "issueName" });

  const timeScore = time.length >= 3 ? 20 : 0;
  score += timeScore;
  if (!timeScore) issues.push({ field: "time", key: "issueTime" });

  let descScore = 0;
  if (description.length >= 20) descScore += 15;
  if (/(fraud|unauthori[sz]ed|unknown|suspicious|non autoris|inconnu|suspect)/.test(desc)) descScore += 10;
  if (/(4[,.]?890|4\s?890|4890|€)/.test(desc)) descScore += 10;
  if (/(bank|account|transaction|banque|compte|bancaire)/.test(desc)) descScore += 5;
  score += descScore;
  if (descScore < 40) issues.push({ field: "description", key: "issueDescription" });

  let affScore = 0;
  if (affected.length >= 3) affScore += 10;
  if (/(bank|account|card|funds|money|compte|bancaire|carte|fonds|argent)/.test(aff)) affScore += 10;
  score += affScore;
  if (affScore < 20) issues.push({ field: "affected", key: "issueAffected" });

  return { score, issues, fields: { nameScore, timeScore, descScore, affScore } };
}

function individualLogView() {
  const sim = c().sim;
  const ui = c().ui;
  const bank = c().bank;

  if (state.logResult) {
    const result = state.logResult;
    const pct = Math.round((result.score / 100) * 100);
    const message = pct >= 80 ? ui.strongLog : pct >= 50 ? ui.goodStart : ui.needsWork;

    const fieldRow = (label, score, max, good, partial) => {
      const text = score === max ? good : score > 0 ? partial : ui.missing;
      return `<li><span>${label}</span><span class="pts">${score}/${max} · ${text}</span></li>`;
    };

    return `
      <p class="eyebrow">${ui.resultEyebrow}</p>
      <h1>${ui.yourLogSheet}</h1>
      <p class="score-big">${result.score}<small> / 100</small></p>
      <p class="lede">${message}</p>

      <h2>${ui.fieldCheck}</h2>
      <ul class="summary-list">
        ${fieldRow(ui.nameLabel, result.fields.nameScore, 20, ui.complete, ui.tooShort)}
        ${fieldRow(ui.timeLabel, result.fields.timeScore, 20, ui.complete, ui.addDate)}
        ${fieldRow(ui.descriptionLabel, result.fields.descScore, 40, ui.complete, ui.addFacts)}
        ${fieldRow(ui.affectedLabel, result.fields.affScore, 20, ui.complete, ui.beSpecific)}
      </ul>

      ${
        result.issues.length
          ? `<div class="feedback partial"><strong>${ui.toImprove}</strong>${result.issues
              .map(
                (issue) =>
                  `<p><strong>${esc(ui[`${issue.field}Label`])}:</strong> ${esc(ui[issue.key])}</p>`
              )
              .join("")}</div>`
          : `<div class="feedback good">${ui.allComplete}</div>`
      }

      <section id="print-area" class="log-sheet">
        <p class="eyebrow">${ui.printEyebrow}</p>
        <h2>${ui.individualTitle}</h2>
        <dl>
          <dt>${ui.nameLabel}</dt><dd>${esc(state.log.name) || "—"}</dd>
          <dt>${ui.timeLabel}</dt><dd>${esc(state.log.time) || "—"}</dd>
          <dt>${ui.descriptionLabel}</dt><dd>${esc(state.log.description) || "—"}</dd>
          <dt>${ui.affectedLabel}</dt><dd>${esc(state.log.affected) || "—"}</dd>
        </dl>
        <p class="hint" style="margin-top:1rem">${esc(bank.account)} · ${esc(bank.date)} · ${esc(bank.amount)} · ${esc(bank.recipient)}</p>
      </section>

      <div class="model">
        <h3>${ui.modelAnswer}</h3>
        <p><strong>${ui.nameLabel}:</strong> ${esc(c().model.name)}</p>
        <p><strong>${ui.timeLabel}:</strong> ${esc(c().model.time)}</p>
        <p><strong>${ui.descriptionLabel}:</strong> ${esc(c().model.description)}</p>
        <p><strong>${ui.affectedLabel}:</strong> ${esc(c().model.affected)}</p>
      </div>

      <div class="btn-row no-print">
        <button class="primary" data-action="print">${ui.print}</button>
        <button class="secondary" data-action="retry-log">${ui.tryAgain}</button>
        <button class="ghost" data-action="go" data-path="">${sim.backHome}</button>
      </div>
    `;
  }

  return `
    <p class="eyebrow">${sim.log}</p>
    <h1>${ui.individualTitle}</h1>
    <p class="lede">${ui.individualLede}</p>

    <div class="phone-app bank-app">
      <div class="app-bar">
        <span class="app-title">${sim.bankTitle}</span>
        <span class="app-sub">${sim.bankAccount}</span>
      </div>
      <div class="balance">
        <span>${sim.bankBalance}</span>
        <strong>€12,340.00</strong>
      </div>
      <div class="tx-row danger">
        <span>${esc(bank.date)} ${esc(bank.time)}</span>
        <span>${sim.bankTransaction}</span>
        <strong>−${esc(bank.amount)}</strong>
      </div>
      <p><strong>${ui.recipient}:</strong> ${esc(bank.recipient)}</p>
      <p><strong>${ui.status}:</strong> ${esc(bank.status)}</p>
      <p class="warning">${esc(sim.bankWarning)}</p>
    </div>

    <div class="notice">${ui.beforeYouWrite}</div>

    <form id="individual-log-form" novalidate>
      ${logFields("individual")}
      <button class="primary" type="submit">${ui.submitLog}</button>
    </form>
  `;
}

/* ---------- Rendering ---------- */

function render() {
  const app = $("#app");
  const route = readRoute();

  if (route.name === "scenario") {
    const key = `${route.mode}:${route.id}`;
    if (key !== routeKey) {
      resetScenario(route.id, route.mode);
      routeKey = key;
    }
  } else {
    if (route.name === "log" && routeKey !== "log") resetLog();
    routeKey = route.name;
  }

  syncChrome();

  if (route.name === "home") app.innerHTML = homeView();
  else if (route.name === "group") app.innerHTML = groupView();
  else if (route.name === "demo") app.innerHTML = demoView();
  else if (route.name === "log") app.innerHTML = individualLogView();
  else app.innerHTML = scenarioView();

  document.body.classList.toggle(
    "presenter",
    route.name === "scenario" && state.mode === "presenter"
  );
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Events ---------- */

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.nav === "home" ? "" : nav.dataset.nav);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "go") {
    navigate(button.dataset.path || "");
  } else if (action === "desk-open") {
    const target = button.dataset.target;
    state.desk.error = null;
    if (target === "mail") {
      doAction("open_mail");
      state.desk.modal = "mail";
    } else if (target === "document") {
      state.desk.doc = button.dataset.doc;
      state.desk.modal = "document";
    } else if (target === "beneficiaries" || target === "finance") {
      state.desk.doc = target;
      state.desk.modal = "document";
    } else {
      state.desk.modal = target;
    }
    render();
  } else if (action === "desk-close") {
    if (
      event.target.closest(".desk-modal-close") ||
      event.target.classList.contains("desk-modal-backdrop")
    ) {
      state.desk.modal = null;
      state.desk.doc = null;
      state.desk.error = null;
      render();
    }
  } else if (action === "desk-action") {
    const id = button.dataset.id;
    if (doAction(id)) {
      if (id === "open_email") state.desk.modal = "email";
      else if (id === "report_email") state.desk.modal = "reported";
      else if (id === "click_link") state.desk.modal = "fakeLogin";
      else if (id === "delete_email") state.desk.modal = "deleted";
      else if (id === "disconnect")
        state.desk.modal = state.desk.modal === "ransom" ? "ransomResult" : "contained";
      else if (id === "pay_ransom" || id === "restart") state.desk.modal = "ransomResult";
      else if (id.startsWith("call_")) state.desk.modal = "phone";
    }
    render();
  } else if (action === "desk-message-template") {
    const field = $("#desk-message");
    if (field) field.value = c().sim.templateText;
  } else if (action === "desk-message-send") {
    const value = button.dataset.value;
    if (value === "false") {
      doAction("false_message");
      state.desk.modal = "debrief";
      state.desk.error = null;
    } else {
      const message = $("#desk-message")?.value.trim() || "";
      if (!message) {
        state.desk.error = "message";
        render();
        return;
      }
      state.message = message;
      doAction("message");
      state.desk.modal = "debrief";
      state.desk.error = null;
    }
    render();
  } else if (action === "lang") {
    const next = button.dataset.lang;
    if (CONTENT[next]) {
      lang = next;
      localStorage.setItem("ngogame.lang", lang);
      render();
    }
  } else if (action === "copy") {
    const text = button.dataset.copy || "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = c().sim.copied;
        setTimeout(() => {
          button.textContent = c().sim.copy;
        }, 1200);
      });
    }
  } else if (action === "screen") {
    state.screen = button.dataset.screen;
    render();
  } else if (action === "open-email") {
    state.screen = "email";
    render();
  } else if (action === "email-open") {
    state.screen = "fakeLogin";
    render();
  } else if (action === "email-report") {
    state.screen = "reported";
    render();
  } else if (action === "email-delete") {
    state.screen = "deleted";
    render();
  } else if (action === "to-ransom") {
    state.screen = "ransom";
    render();
  } else if (action === "to-contain") {
    state.screen = "contain";
    render();
  } else if (action === "ransom") {
    state.ransomAction = button.dataset.value;
    state.screen = "ransomResult";
    render();
  } else if (action === "contain-toggle") {
    const value = button.dataset.value;
    state.containActions = state.containActions.includes(value)
      ? state.containActions.filter((item) => item !== value)
      : [...state.containActions, value];
    render();
  } else if (action === "to-contacts") {
    state.screen = "contacts";
    render();
  } else if (action === "call-contact") {
    const id = button.dataset.id;
    state.contacts = state.contacts.includes(id)
      ? state.contacts.filter((item) => item !== id)
      : [...state.contacts, id];
    render();
  } else if (action === "to-log") {
    state.screen = "log";
    render();
  } else if (action === "message-template") {
    const field = $("#message-text");
    if (field) field.value = c().sim.templateText;
  } else if (action === "send-message") {
    state.message = $("#message-text")?.value || "";
    state.screen = "debrief";
    render();
  } else if (action === "replay") {
    resetScenario(state.scenarioId, state.mode);
    render();
  } else if (action === "laptop") {
    state.laptopAction = button.dataset.value;
    state.screen = "laptopResult";
    render();
  } else if (action === "to-contacts-laptop") {
    state.screen = "contacts";
    render();
  } else if (action === "print") {
    window.print();
  } else if (action === "retry-log") {
    resetLog();
    render();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "desk-log-form") {
    event.preventDefault();
    const log = readLog("desk");
    state.log = log;
    const complete = Object.values(log).every((value) => value.trim().length > 0);
    if (!complete) {
      state.desk.error = "log";
      render();
      return;
    }
    doAction("log");
    state.desk.modal = "debrief";
    state.desk.error = null;
    render();
    return;
  }

  if (event.target.id === "scenario-log-form") {
    event.preventDefault();
    state.log = readLog("scenario");
    state.screen = "message";
    render();
  }

  if (event.target.id === "individual-log-form") {
    event.preventDefault();
    state.log = readLog("individual");
    state.logResult = evaluateLog(state.log);
    render();
  }
});

window.addEventListener("hashchange", render);

render();
