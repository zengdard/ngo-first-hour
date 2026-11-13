/* 9:14 — The First Hour
   Static, bilingual (EN/FR), phone-first. No backend, no account. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const esc = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

const t = (template, vars = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`));

let lang = localStorage.getItem("ngogame.lang");
if (!lang || !CONTENT[lang]) {
  lang = navigator.language && navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

const c = () => CONTENT[lang];

const state = {
  screen: "home",
  mode: "player",
  team: "",
  scenarioId: null,
  step: 0,
  score: 0,
  selected: null,
  answers: [],
  completed: {},
  meters: { time: 60, trust: 50, contain: 0 },
  showFakeLogin: false,
  individual: { name: "", time: "", description: "", affected: "" },
  individualResult: null,
};

let scrollOnRender = true;

/* ---------- Chrome ---------- */

function syncChrome() {
  const ui = c().ui;
  document.documentElement.lang = lang;
  const brand = $("#brand-sub");
  if (brand) brand.textContent = ui.brandSubtitle;
  const navHome = $("#nav-home");
  if (navHome) navHome.textContent = ui.navHome;
  const navGroup = $("#nav-group");
  if (navGroup) navGroup.textContent = ui.navGroup;
  const navIndividual = $("#nav-individual");
  if (navIndividual) navIndividual.textContent = ui.navIndividual;
  const footer = $("#footer-text");
  if (footer) footer.textContent = ui.footer;
  $$(".lang button").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
    button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
  });
}

/* ---------- Views ---------- */

function homeView() {
  const ui = c().ui;
  return `
    <section class="hero">
      <p class="eyebrow">${ui.homeEyebrow}</p>
      <h1>${ui.homeTitle}</h1>
      <p class="lede">${ui.homeLede}</p>
      <p class="core">${ui.homeCore}</p>
    </section>

    <div class="grid">
      <article class="card">
        <span class="tag">${ui.groupTag}</span>
        <h2>${ui.groupTitle}</h2>
        <p>${ui.groupText}</p>
        <div class="btn-row">
          <button class="primary" data-action="start-group" data-mode="presenter">${ui.presenterBtn}</button>
          <button class="secondary" data-action="start-group" data-mode="player">${ui.playerBtn}</button>
        </div>
      </article>

      <article class="card">
        <span class="tag warn">${ui.individualTag}</span>
        <h2>${ui.individualTitle}</h2>
        <p>${ui.individualText}</p>
        <div class="btn-row">
          <button class="primary" data-action="start-individual">${ui.individualBtn}</button>
        </div>
      </article>
    </div>

    <div class="notice" style="margin-top:1.2rem">${ui.noAccount}</div>
  `;
}

function groupSelectView() {
  const ui = c().ui;
  const isPresenter = state.mode === "presenter";
  const scenarios = c().scenarios;

  const cards = Object.values(scenarios)
    .map((scenario) => {
      const done = state.completed[scenario.id];
      return `
        <article class="card">
          <span class="tag">${esc(scenario.label)}</span>
          <h2>${esc(scenario.title)}</h2>
          <p>${esc(scenario.subtitle)}</p>
          ${done !== undefined ? `<span class="tag good">${ui.completed} · ${done}/50</span>` : ""}
          <div class="btn-row">
            <button class="primary" data-action="start-scenario" data-id="${scenario.id}">${ui.startScenario}</button>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <p class="eyebrow">${ui.groupSelectEyebrow}</p>
    <h1>${ui.groupSelectTitle}</h1>
    <p class="lede">${ui.groupSelectLede}</p>

    <div class="meta">
      <span class="badge ${isPresenter ? "presenter" : ""}">${isPresenter ? ui.presenterMode : ui.playerMode}</span>
      <span>2 × 5</span>
    </div>

    ${
      isPresenter
        ? ""
        : `<div class="field" style="margin-bottom:1rem">
            <label for="team-name">${ui.teamName} <span class="hint">${ui.optional}</span></label>
            <input id="team-name" type="text" maxlength="40" value="${esc(state.team)}" placeholder="Team Resilience" />
          </div>`
    }

    <div class="grid">${cards}</div>

    <div class="btn-row">
      <button class="ghost" data-nav="home">${ui.backHome}</button>
    </div>
  `;
}

function contextView(context) {
  const ui = c().ui;
  if (context.type === "email") {
    return `
      <div class="scenario-context">
        <div class="mail-head">
          <div class="mail-avatar" aria-hidden="true">BL</div>
          <div class="mail-meta">
            <div><strong>${esc(context.from)}</strong></div>
            <div class="mail-subject">${esc(context.subject)}</div>
          </div>
        </div>
        <p class="mail-body">${esc(context.body)}</p>
        ${context.link ? `<p class="mail-link">${esc(context.link)}</p>` : ""}
        <span class="attachment">${esc(context.attachment)}</span>
        ${context.footer ? `<p class="mail-body" style="margin-top:.9rem">${esc(context.footer)}</p>` : ""}
      </div>
    `;
  }

  return `
    <div class="scenario-context">
      <h3>${esc(context.title)}</h3>
      <p class="mail-body">${esc(context.body)}</p>
      <ul>${context.details.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function metersView() {
  const ui = c().ui;
  return `
    <div class="meters" aria-label="Game meters">
      <div class="meter"><span>${ui.timeLeft}</span><strong>${state.meters.time}:00</strong></div>
      <div class="meter"><span>${ui.donorTrust}</span><strong>${state.meters.trust}/100</strong></div>
      <div class="meter"><span>${ui.containment}</span><strong>${state.meters.contain}/5</strong></div>
    </div>
  `;
}

function fakeLoginView() {
  const ui = c().ui;
  return `
    <div class="fake-login" role="img" aria-label="${ui.simulation}">
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
  `;
}

function groupView() {
  const ui = c().ui;
  const scenario = c().scenarios[state.scenarioId];
  const step = scenario.steps[state.step];
  const total = scenario.steps.length;
  const progress = Math.round((state.step / total) * 100);
  const isPresenter = state.mode === "presenter";

  const options = step.options
    .map((option, index) => {
      let cls = "option";
      if (state.selected !== null) {
        if (index === state.selected) {
          cls += option.quality === "good" ? " correct" : option.quality === "partial" ? " selected" : " wrong";
        }
        if (option.quality === "good" && index !== state.selected) cls += " correct";
      }
      return `
        <button class="${cls}" data-action="choose" data-index="${index}" ${state.selected !== null ? "disabled" : ""}>
          <span class="letter">${String.fromCharCode(65 + index)}</span>
          <span>${esc(option.text)}</span>
        </button>
      `;
    })
    .join("");

  let feedback = "";
  if (state.selected !== null) {
    const option = step.options[state.selected];
    const cls = option.quality === "good" ? "good" : option.quality === "partial" ? "partial" : "bad";
    const label =
      option.quality === "good" ? ui.correct : option.quality === "partial" ? ui.partlyRight : ui.notBest;
    feedback = `
      <div class="feedback ${cls}" role="status">
        <strong>${label} · +${option.points} ${ui.points}</strong>
        <p>${esc(option.feedback)}</p>
      </div>
      ${state.showFakeLogin ? fakeLoginView() : ""}
      <button class="primary" data-action="next">
        ${state.step < total - 1 ? ui.nextStep : ui.seeResult}
      </button>
    `;
  }

  return `
    <div class="meta">
      <span class="badge ${isPresenter ? "presenter" : ""}">${isPresenter ? ui.presenterMode : ui.playerMode}</span>
      <span>${esc(scenario.label)} · ${esc(scenario.title)}</span>
      ${state.team && !isPresenter ? `<span>${esc(state.team)}</span>` : ""}
    </div>

    <p class="eyebrow">${t(ui.stepOf, { n: state.step + 1, total })}</p>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
      <div style="width:${progress}%"></div>
    </div>

    ${contextView(scenario.context)}
    ${metersView()}

    <p class="prompt" id="prompt">${esc(step.prompt)}</p>
    ${isPresenter && step.tip ? `<p class="tip"><strong>${ui.presenterTip}:</strong> ${esc(step.tip)}</p>` : ""}

    <div class="options" role="group" aria-labelledby="prompt">${options}</div>

    ${feedback}

    <div class="btn-row">
      <button class="ghost" data-nav="group-select">${ui.leaveScenario}</button>
    </div>
  `;
}

function groupEndView() {
  const ui = c().ui;
  const scenario = c().scenarios[state.scenarioId];
  const max = scenario.steps.length * 10;
  const pct = Math.round((state.score / max) * 100);
  const done = Object.keys(state.completed).length;
  const total = Object.values(state.completed).reduce((sum, value) => sum + value, 0);
  const other = state.scenarioId === "phishing" ? "laptop" : "phishing";

  const summary = scenario.steps
    .map((step, index) => {
      const answer = state.answers.find((item) => item.step === index);
      const points = answer ? answer.points : 0;
      return `<li><span>${esc(step.title)}</span><span class="pts">${points}/10</span></li>`;
    })
    .join("");

  const message = pct >= 80 ? ui.percentStrong : pct >= 50 ? ui.percentGood : ui.percentNeeds;

  return `
    <p class="eyebrow">${esc(scenario.label)} · ${ui.completed}</p>
    <h1>${ui.scenarioResult}</h1>
    <p class="score-big">${state.score}<small> / ${max}</small></p>
    <p class="lede">${pct}% — ${message}</p>

    ${metersView()}

    <h2>${ui.yourDecisions}</h2>
    <ul class="summary-list">${summary}</ul>

    ${
      done === 2
        ? `<div class="notice">${t(ui.totalBoth, { total })}</div>`
        : `<div class="notice">${ui.backScenarios}</div>`
    }

    <div class="btn-row">
      <button class="primary" data-action="start-scenario" data-id="${other}">${ui.playOther}</button>
      <button class="secondary" data-nav="group-select">${ui.backScenarios}</button>
      <button class="ghost" data-nav="home">${ui.navHome}</button>
    </div>
  `;
}

function individualView() {
  const ui = c().ui;
  const bank = c().bank;
  return `
    <p class="eyebrow">${ui.individualEyebrow}</p>
    <h1>${ui.individualTitle}</h1>
    <p class="lede">${ui.individualLede}</p>

    <div class="bank-card">
      <p class="eyebrow" style="margin-bottom:.2rem">${esc(bank.account)} — ${ui.statement}</p>
      <div class="tx">
        <span>${esc(bank.date)} ${esc(bank.time)}</span>
        <span>${ui.payment}</span>
        <strong>−${esc(bank.amount)}</strong>
      </div>
      <p><strong>${ui.recipient}:</strong> ${esc(bank.recipient)}</p>
      <p><strong>${ui.status}:</strong> ${esc(bank.status)}</p>
      <p class="warning">${esc(bank.note)}</p>
    </div>

    <div class="notice">${ui.beforeYouWrite}</div>

    <form id="log-form" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="log-name">${ui.nameLabel} <span class="hint">${ui.nameHint}</span></label>
          <input id="log-name" name="name" type="text" autocomplete="name" maxlength="120"
            value="${esc(state.individual.name)}" placeholder="${esc(ui.namePlaceholder)}" />
        </div>

        <div class="field">
          <label for="log-time">${ui.timeLabel} <span class="hint">${ui.timeHint}</span></label>
          <input id="log-time" name="time" type="text" maxlength="80"
            value="${esc(state.individual.time)}" placeholder="${esc(ui.timePlaceholder)}" />
        </div>

        <div class="field">
          <label for="log-description">${ui.descriptionLabel} <span class="hint">${ui.descriptionHint}</span></label>
          <textarea id="log-description" name="description" maxlength="1200"
            placeholder="${esc(ui.descriptionPlaceholder)}">${esc(state.individual.description)}</textarea>
        </div>

        <div class="field">
          <label for="log-affected">${ui.affectedLabel} <span class="hint">${ui.affectedHint}</span></label>
          <input id="log-affected" name="affected" type="text" maxlength="200"
            value="${esc(state.individual.affected)}" placeholder="${esc(ui.affectedPlaceholder)}" />
        </div>
      </div>

      <button class="primary" type="submit">${ui.submitLog}</button>
    </form>

    <div class="btn-row">
      <button class="ghost" data-nav="home">${ui.backHome}</button>
    </div>
  `;
}

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
  if (/(fraud|unauthori[sz]ed|unknown|suspicious)/.test(desc)) descScore += 10;
  if (/(4[,.]?890|4890|€)/.test(desc)) descScore += 10;
  if (/(bank|account|transaction)/.test(desc)) descScore += 5;
  score += descScore;
  if (descScore < 40) issues.push({ field: "description", key: "issueDescription" });

  let affScore = 0;
  if (affected.length >= 3) affScore += 10;
  if (/(bank|account|card|funds|money)/.test(aff)) affScore += 10;
  score += affScore;
  if (affScore < 20) issues.push({ field: "affected", key: "issueAffected" });

  return { score, issues, fields: { nameScore, timeScore, descScore, affScore } };
}

function individualFeedbackView() {
  const ui = c().ui;
  const bank = c().bank;
  const data = state.individual;
  const result = state.individualResult;
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
        <dt>${ui.nameLabel}</dt><dd>${esc(data.name) || "—"}</dd>
        <dt>${ui.timeLabel}</dt><dd>${esc(data.time) || "—"}</dd>
        <dt>${ui.descriptionLabel}</dt><dd>${esc(data.description) || "—"}</dd>
        <dt>${ui.affectedLabel}</dt><dd>${esc(data.affected) || "—"}</dd>
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
      <button class="secondary" data-action="retry-individual">${ui.tryAgain}</button>
      <button class="ghost" data-nav="home">${ui.navHome}</button>
    </div>
  `;
}

/* ---------- Rendering ---------- */

function render() {
  const app = $("#app");
  const views = {
    home: homeView,
    "group-select": groupSelectView,
    group: groupView,
    "group-end": groupEndView,
    individual: individualView,
    "individual-feedback": individualFeedbackView,
  };

  syncChrome();
  const view = views[state.screen] || homeView;
  app.innerHTML = view();
  document.body.classList.toggle(
    "presenter",
    state.mode === "presenter" && (state.screen === "group" || state.screen === "group-end")
  );
  app.focus({ preventScroll: true });

  if (scrollOnRender) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    scrollOnRender = false;
  }
}

/* ---------- Actions ---------- */

function startScenario(id) {
  const teamInput = $("#team-name");
  if (teamInput) state.team = teamInput.value.trim();

  state.scenarioId = id;
  state.step = 0;
  state.score = 0;
  state.selected = null;
  state.answers = [];
  state.showFakeLogin = false;
  state.meters = { time: 60, trust: 50, contain: 0 };
  state.screen = "group";
  scrollOnRender = true;
  render();
}

function choose(index) {
  if (state.selected !== null) return;
  const scenario = c().scenarios[state.scenarioId];
  const step = scenario.steps[state.step];
  const option = step.options[index];
  if (!option) return;

  state.selected = index;
  state.score += option.points;
  state.meters.time = Math.max(0, state.meters.time + (option.effect?.time ?? 0));
  state.meters.trust = Math.max(0, Math.min(100, state.meters.trust + (option.effect?.trust ?? 0)));
  state.meters.contain = Math.max(0, Math.min(5, state.meters.contain + (option.effect?.contain ?? 0)));
  state.answers.push({ step: state.step, optionIndex: index, points: option.points });

  // Scenario A, step 1, "click the link": show the fake bank login imitation.
  state.showFakeLogin = state.scenarioId === "phishing" && state.step === 0 && index === 0;

  render();
}

function nextStep() {
  const scenario = c().scenarios[state.scenarioId];
  if (state.step < scenario.steps.length - 1) {
    state.step += 1;
    state.selected = null;
    state.showFakeLogin = false;
    scrollOnRender = true;
    render();
  } else {
    state.completed[state.scenarioId] = state.score;
    state.screen = "group-end";
    state.showFakeLogin = false;
    scrollOnRender = true;
    render();
  }
}

function submitLog() {
  const data = {
    name: $("#log-name").value,
    time: $("#log-time").value,
    description: $("#log-description").value,
    affected: $("#log-affected").value,
  };
  state.individual = data;
  state.individualResult = evaluateLog(data);
  state.screen = "individual-feedback";
  scrollOnRender = true;
  render();
}

/* ---------- Events ---------- */

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    event.preventDefault();
    state.screen = nav.dataset.nav;
    if (state.screen === "group-select" && !state.mode) state.mode = "player";
    scrollOnRender = true;
    render();
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "start-group") {
    state.mode = button.dataset.mode || "player";
    state.screen = "group-select";
    scrollOnRender = true;
    render();
  } else if (action === "start-scenario") {
    startScenario(button.dataset.id);
  } else if (action === "choose") {
    choose(Number(button.dataset.index));
  } else if (action === "next") {
    nextStep();
  } else if (action === "start-individual") {
    state.screen = "individual";
    scrollOnRender = true;
    render();
  } else if (action === "print") {
    window.print();
  } else if (action === "retry-individual") {
    state.individual = { name: "", time: "", description: "", affected: "" };
    state.individualResult = null;
    state.screen = "individual";
    scrollOnRender = true;
    render();
  } else if (action === "lang") {
    const next = button.dataset.lang;
    if (CONTENT[next]) {
      lang = next;
      localStorage.setItem("ngogame.lang", lang);
      syncChrome();
      render();
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "log-form") {
    event.preventDefault();
    submitLog();
  }
});

render();
