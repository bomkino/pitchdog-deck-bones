import "./styles.css";
import { buildDeckPlan } from "./plan.ts";
import {
  ACCESS, ASKS, BOUNDARIES, DEADLINES, DELIVERIES, ENCOUNTERS, FINANCE, FORMATS, GOALS, LIMITS,
  MATERIALS, OUTSIDE_READS, PRIORITIES, RECIPIENTS, RECIPIENT_SHAPES, RELATIONSHIPS, REQUIREMENTS,
  ROLES, SERIES_SHAPES, STAGES, VISUALS,
} from "./content.ts";
import type { AppState, DeckAnswers, Ride } from "./types.ts";
import {
  attachReveal, attachTilt, bindTheme, choiceGrid, clearSession, downloadText, escapeHTML, footer,
  header, initialiseThreadCursor, landAtTop, progress, readSession, writeSession, type Choice, type ProductMeta,
} from "./ui.ts";

const META: ProductMeta = { name: "Deck Bones.", eyebrow: "Film & TV only", storageKey: "deck-bones.theme" };
const SESSION_KEY = "deck-bones.session.v2";
const app = document.querySelector<HTMLDivElement>("#app")!;
if (!app) throw new Error("Deck Bones could not find its stage.");
document.body.dataset.product = "deck-bones";

const fallback: AppState = { phase: "landing", step: 0, answers: { boundaries: [] } };
const state = readSession<AppState>(SESSION_KEY, fallback);
state.answers = { ...state.answers, boundaries: state.answers.boundaries ?? [] };

interface Step {
  key: keyof DeckAnswers;
  kicker: string;
  question: string;
  note: string;
  choices: readonly Choice[];
  rides: readonly Ride[];
  multiple?: boolean;
  when?: (answers: DeckAnswers) => boolean;
}

const STEPS: readonly Step[] = [
  { key: "format", kicker: "The project", question: "What are you making?", note: "Deck Bones is deliberately for scripted features and scripted series. Other forms deserve their own logic.", choices: FORMATS, rides: ["quick", "expert"] },
  { key: "goal", kicker: "The job", question: "What should this deck help happen?", note: "Pick the closest one. The document follows the decision—not the fashionable name.", choices: GOALS, rides: ["quick", "expert"] },
  { key: "specificAsk", kicker: "The request", question: "What did they actually ask for?", note: "Choose the closest written item. No prose box, no pretending we can read your mind.", choices: ASKS, rides: ["quick", "expert"], when: (a) => a.goal === "specific" },
  { key: "recipient", kicker: "The reader", question: "Who needs to lean in—or say yes?", note: "Same project, different decision. This changes what earns a page.", choices: RECIPIENTS, rides: ["quick", "expert"] },
  { key: "stage", kicker: "The work", question: "How far is the core project?", note: "A deck cannot do the screenplay or pilot’s job. It can help once the core proof exists.", choices: STAGES, rides: ["quick", "expert"] },
  { key: "materials", kicker: "What exists", question: "What useful material is already on file?", note: "Reuse before reinvention. Your previous work has not suddenly become rubbish.", choices: MATERIALS, rides: ["quick", "expert"] },
  { key: "role", kicker: "Your seat", question: "What is your real role in this version?", note: "Authorship changes which pages are evidence and which are borrowed authority.", choices: ROLES, rides: ["expert"] },
  { key: "seriesShape", kicker: "The form", question: "What keeps the series moving?", note: "Returning work needs repeatable pressure. Limited work needs complete progression.", choices: SERIES_SHAPES, rides: ["expert"], when: (a) => a.format === "series" },
  { key: "relationship", kicker: "The relationship", question: "How well do they know you?", note: "Cold readers need orientation. Familiar readers do not need a memoir.", choices: RELATIONSHIPS, rides: ["expert"] },
  { key: "recipientShape", kicker: "The room", question: "How many decisions are hiding in this audience?", note: "Several names are fine. Several different asks usually need separate versions.", choices: RECIPIENT_SHAPES, rides: ["expert"] },
  { key: "access", kicker: "The route", question: "How can this honestly reach them?", note: "A famous company logo is not an access route. Annoying, but useful.", choices: ACCESS, rides: ["expert"] },
  { key: "delivery", kicker: "The encounter", question: "How will they meet the deck?", note: "Live slides support a voice. A read-alone deck must carry its own context.", choices: DELIVERIES, rides: ["expert"] },
  { key: "encounter", kicker: "The clock", question: "How much attention does this version get?", note: "A five-minute room and a controlled read are different editorial objects.", choices: ENCOUNTERS, rides: ["expert"] },
  { key: "outsideRead", kicker: "The core proof", question: "What outside reading has the script or pilot had?", note: "A first draft may need one useful read more than it needs twelve beautiful pages.", choices: OUTSIDE_READS, rides: ["expert"] },
  { key: "visuals", kicker: "The visual case", question: "How ready is the visual language?", note: "A deck can be beautiful without laundering a found image into permission.", choices: VISUALS, rides: ["expert"] },
  { key: "requirementStatus", kicker: "The instruction", question: "How current is the request?", note: "Current, stage-specific rules outrank every generic deck template on Earth.", choices: REQUIREMENTS, rides: ["expert"] },
  { key: "pageLimit", kicker: "The container", question: "What page boundary are you working inside?", note: "No stated limit does not mean no editorial limit.", choices: LIMITS, rides: ["expert"] },
  { key: "financeBasis", kicker: "The money facts", question: "If money enters the deck, what basis exists?", note: "Creative tools do not get to invent budgets, returns, recoupment, or certainty.", choices: FINANCE, rides: ["expert"], when: (a) => a.goal === "funding" },
  { key: "boundaries", kicker: "The honest boundary", question: "What must not be hand-waved?", note: "Pick all that apply. A narrow boundary should not freeze unrelated creative work.", choices: BOUNDARIES, rides: ["expert"], multiple: true },
  { key: "deadline", kicker: "The deadline", question: "When does this version need to be useful?", note: "A deadline changes sequence and scope. It does not make unsupported claims true.", choices: DEADLINES, rides: ["expert"] },
  { key: "priority", kicker: "The cut", question: "What kind of version do you actually need?", note: "Small is not lesser. Complete is not automatically useful.", choices: PRIORITIES, rides: ["expert"] },
];

function steps(): Step[] { return STEPS.filter((step) => step.rides.includes(state.ride ?? "quick") && (!step.when || step.when(state.answers))); }
function save(): void { writeSession(SESSION_KEY, state); }

function render(top = true): void {
  const active = steps();
  if (state.phase === "flow") state.step = Math.max(0, Math.min(state.step, Math.max(0, active.length - 1)));
  const trail = state.phase === "flow" ? `${state.ride === "expert" ? "Expert" : "Quick"} planner · ${state.step + 1} of ${active.length}` : undefined;
  document.title = state.phase === "result" ? `${state.result?.headline ?? "Your deck plan"} — Deck Bones` : "Deck Bones — plan a Film & TV deck";
  app.innerHTML = `${header(META, trail)}<main id="main">${page()}</main>${state.phase === "landing" || state.phase === "result" ? footer("Deck Bones") : ""}`;
  bindTheme(META.storageKey);
  bindEvents(); attachReveal(); attachTilt();
  if (top) landAtTop();
}

function page(): string { return state.phase === "flow" ? flowPage() : state.phase === "result" && state.result ? resultPage() : landingPage(); }

function landingPage(): string {
  return `<section class="landing deck-landing">
    <div class="landing-copy">
      <p class="scope-tag">Film & TV only · scripted features and series</p><p class="kicker">A deck with a reason to exist.</p>
      <h1 data-page-heading tabindex="-1">Plan the deck.</h1>
      <p class="landing-lede">Choose the real reader and the next decision. Get a useful Film & TV structure out—without blank boxes, template theater, or a thirty-page tax return.</p>
      <div class="landing-proof"><span>Bold choices only</span><span>Pages have one job</span><span>Nothing leaves the browser</span></div>
      <a class="primary-action" href="#choose-a-route">Choose your route <span aria-hidden="true">↓</span></a>
    </div>
    <div class="landing-art" data-tilt="1.4" aria-hidden="true"><img src="/assets/hero.webp" alt=""><p class="landing-art__note">The useful deck is not the one with the most pages. It is the one that helps this person make this decision.</p></div>
  </section>
  <section class="ride-section" id="choose-a-route">
    <div class="section-heading"><p class="kicker">Choose your level of commitment</p><h2>Five choices—or the real planning room.</h2><p>The quick route gives you a strong starting structure. A specific request adds one useful follow-up. Expert mode asks what materially changes the deck, then shows exactly what changed.</p></div>
    <div class="ride-grid">
      <button class="ride-card" data-ride="quick" type="button"><span class="ride-number">01</span><small>About 45 seconds · 5–6 choices</small><strong>Give me the useful plan.</strong><p>Format, job, reader, stage, and what already exists. No typing.</p><em>Start quick planner ↗</em></button>
      <button class="ride-card ride-card--expert" data-ride="expert" type="button"><span class="ride-number">02</span><small>About 4 minutes · up to 21 short choices</small><strong>Plan the exact version.</strong><p>Route, relationship, delivery, series shape, rights, current requirements, money facts, time, and boundaries.</p><em>Enter expert mode ↗</em></button>
    </div>
  </section>`;
}

function flowPage(): string {
  const active = steps();
  const step = active[state.step]!;
  const current = state.answers[step.key];
  const selected = typeof current === "string" ? current : undefined;
  const many = step.key === "boundaries" ? state.answers.boundaries : [];
  return `<section class="question-page">
    ${progress(`${state.ride === "expert" ? "Expert" : "Quick"} Film & TV deck planner`, state.step, active.length)}
    <div class="question-layout">
      <div class="question-copy"><button class="question-back" id="flow-back" type="button">← ${state.step ? "Previous question" : "Choose another route"}</button><div class="question-art" aria-hidden="true"><img src="/assets/hero.webp" alt=""></div><p class="scope-tag">Deck Bones · Film & TV only</p><p class="kicker">${step.kicker}</p><h1 data-page-heading tabindex="-1">${step.question}</h1><p>${step.note}</p></div>
      <div class="answers-panel"><div class="answers-inner"><p class="answers-instruction">${step.multiple ? "Pick every boundary that is real. Nothing else." : "Pick the closest truth. We’ll do the fussy translation."}</p>${choiceGrid(step.choices, step.multiple ? "multi-choice" : "flow-choice", selected, many)}${step.multiple ? '<button class="primary-action multi-continue" id="multi-continue" type="button">Keep going <span aria-hidden="true">↗</span></button>' : ""}</div></div>
    </div>
  </section>`;
}

function resultPage(): string {
  const result = state.result!;
  const destination = result.preDeckAction ? ["#before-the-deck", "See what comes first"] : ["#deck-pages", "See the pages"];
  return `<section class="result-page deck-result">
    <div class="result-hero"><div class="result-art" data-tilt="1.2" aria-hidden="true"><img src="/assets/hero.webp" alt=""></div><p class="scope-tag">Your Film & TV deck plan · ${state.ride === "expert" ? "expert context applied" : "quick route"}</p><h1 data-page-heading tabindex="-1">${escapeHTML(result.headline)}</h1><p>${escapeHTML(result.intro)}</p><div class="result-actions"><a class="primary-action" href="${destination[0]}">${destination[1]} <span aria-hidden="true">↓</span></a><button class="text-action" id="download-plan" type="button">Download the plan</button><button class="text-action" id="change-answers" type="button">Change answers</button>${state.ride === "quick" ? '<button class="text-action" id="go-expert" type="button">Take the expert route</button>' : ""}<button class="text-action" id="start-over" type="button">Start over</button></div></div>
    <section class="version-brief" data-reveal><p class="kicker">This exact version</p><dl>${result.versionBrief.map(([key, value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl></section>
    ${result.preDeckAction ? `<section class="pre-deck" id="before-the-deck" data-reveal><p class="kicker">Do this before the deck</p><h2>${escapeHTML(result.preDeckAction)}</h2><p>The tool is not judging the project. It is refusing to make packaging impersonate core work or qualified evidence.</p></section>` : pages(result)}
    <section class="result-details">
      <details open><summary>Why this plan</summary><ul>${result.reasons.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>
      ${result.expertNotes.length ? `<details open><summary>What your expert answers changed</summary><ul>${result.expertNotes.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>` : ""}
      ${result.optional.length ? `<details><summary>Useful later—not in the main path (${result.optional.length})</summary><div class="parked-grid">${result.optional.map((item) => `<article><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.job)}</p><small>${escapeHTML(item.reason)}</small></article>`).join("")}</div></details>` : ""}
      <details><summary>Leave this out</summary><ul>${result.leaveOut.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>
      <details><summary>Assumptions and limits</summary><ul>${result.raw.limitations.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>
    </section>
  </section>`;
}

function pages(result: NonNullable<AppState["result"]>): string {
  return `<section class="deck-pages" id="deck-pages"><div class="deck-pages__heading"><p class="kicker">The pages</p><h2>Every page gets one job.</h2><p>Scroll sideways. This stays a deck—not an endless vertical tax return.</p><div class="rail-controls"><button id="rail-prev" type="button" aria-label="Previous page">←</button><span id="rail-status">Page 1 / ${result.sections.length}</span><button id="rail-next" type="button" aria-label="Next page">→</button></div></div><div class="page-rail" id="page-rail" tabindex="0" role="region" aria-label="Film and TV deck pages">${result.sections.map((item, index) => `<article class="deck-page" data-page-index="${index}" aria-current="${index === 0 ? "true" : "false"}"><span>${String(index + 1).padStart(2, "0")}</span><small>${escapeHTML(item.name)}</small><h3>${escapeHTML(item.job)}</h3><p>${escapeHTML(item.doneWhen)}</p><i aria-hidden="true"></i></article>`).join("")}</div></section>`;
}

function setAnswer(key: keyof DeckAnswers, value: string): void {
  const target = state.answers as unknown as Record<string, unknown>;
  target[key] = value;
  if (key === "format" && value !== "series") delete target.seriesShape;
  if (key === "goal" && value !== "specific") delete target.specificAsk;
  if (key === "goal" && value !== "funding") delete target.financeBasis;
}

function advance(): void {
  const active = steps();
  if (state.step < active.length - 1) state.step += 1;
  else { state.result = buildDeckPlan(state.answers); state.phase = "result"; }
  save(); render(true);
}

function bindEvents(): void {
  document.querySelector(".brand")?.addEventListener("click", (event) => {
    event.preventDefault(); state.phase = "landing"; state.ride = undefined; state.result = undefined; save(); render(true);
  });
  document.querySelectorAll<HTMLButtonElement>("[data-ride]").forEach((button) => button.addEventListener("click", () => {
    state.ride = button.dataset.ride as Ride; state.phase = "flow"; state.step = 0; state.answers = { boundaries: [] }; save(); render(true);
  }));
  document.querySelectorAll<HTMLButtonElement>("[data-flow-choice]").forEach((button) => button.addEventListener("click", () => {
    const step = steps()[state.step]!; setAnswer(step.key, button.dataset.flowChoice ?? ""); advance();
  }));
  document.querySelectorAll<HTMLButtonElement>("[data-multi-choice]").forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.multiChoice ?? "";
    const many = new Set(state.answers.boundaries);
    if (value === "none") { many.clear(); many.add("none"); }
    else { many.delete("none"); many.has(value) ? many.delete(value) : many.add(value); }
    state.answers.boundaries = [...many]; save(); render(false);
  }));
  document.querySelector("#multi-continue")?.addEventListener("click", advance);
  document.querySelector("#flow-back")?.addEventListener("click", () => {
    if (state.step > 0) state.step -= 1; else state.phase = "landing"; save(); render(true);
  });
  document.querySelector("#change-answers")?.addEventListener("click", () => { state.phase = "flow"; state.step = Math.max(0, steps().length - 1); save(); render(true); });
  document.querySelector("#go-expert")?.addEventListener("click", () => { state.ride = "expert"; state.phase = "flow"; state.step = 0; state.result = undefined; save(); render(true); });
  document.querySelector("#start-over")?.addEventListener("click", () => { clearSession(SESSION_KEY); Object.assign(state, fallback, { answers: { boundaries: [] } }); render(true); });
  document.querySelector("#download-plan")?.addEventListener("click", () => downloadText("deck-bones-plan.md", planMarkdown()));
  const rail = document.querySelector<HTMLElement>("#page-rail");
  const cards = [...(rail?.querySelectorAll<HTMLElement>(".deck-page") ?? [])];
  const previous = document.querySelector<HTMLButtonElement>("#rail-prev");
  const next = document.querySelector<HTMLButtonElement>("#rail-next");
  const status = document.querySelector<HTMLElement>("#rail-status");
  let railIndex = 0;
  let railFrame = 0;
  const paintRail = () => {
    previous && (previous.disabled = railIndex <= 0);
    next && (next.disabled = railIndex >= cards.length - 1);
    if (status) status.textContent = `Page ${railIndex + 1} / ${cards.length}`;
    cards.forEach((card, index) => card.setAttribute("aria-current", String(index === railIndex)));
  };
  const nearestRailIndex = () => {
    if (!rail || !cards.length) return 0;
    const first = cards[0]!.offsetLeft;
    return cards.reduce((nearest, card, index) => Math.abs(card.offsetLeft - first - rail.scrollLeft) < Math.abs(cards[nearest]!.offsetLeft - first - rail.scrollLeft) ? index : nearest, 0);
  };
  const moveRail = (direction: number) => {
    if (!rail || !cards.length) return;
    railIndex = Math.max(0, Math.min(cards.length - 1, railIndex + direction));
    rail.scrollTo({ left: cards[railIndex]!.offsetLeft - cards[0]!.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    paintRail();
  };
  previous?.addEventListener("click", () => moveRail(-1));
  next?.addEventListener("click", () => moveRail(1));
  rail?.addEventListener("scroll", () => { cancelAnimationFrame(railFrame); railFrame = requestAnimationFrame(() => { railIndex = nearestRailIndex(); paintRail(); }); }, { passive: true });
  rail?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); moveRail(event.key === "ArrowLeft" ? -1 : 1); }
    if (event.key === "Home" || event.key === "End") { event.preventDefault(); railIndex = event.key === "Home" ? 1 : cards.length - 2; moveRail(event.key === "Home" ? -1 : 1); }
  });
  paintRail();
}

function planMarkdown(): string {
  const result = state.result;
  if (!result) return "# Deck Bones\n\nNo plan yet.\n";
  const pages = result.sections.length
    ? result.sections.map((item, index) => `${index + 1}. **${item.name}** — ${item.job}\n   Done when: ${item.doneWhen}`).join("\n")
    : "No deck pages yet. Complete the prerequisite first.";
  const optional = result.optional.length
    ? result.optional.map((item) => `- **${item.name}:** ${item.job} — ${item.reason}`).join("\n")
    : "- Nothing parked.";
  const expert = result.expertNotes.length ? result.expertNotes.map((item) => `- ${item}`).join("\n") : "- Quick-route assumptions remain visible in the plan.";
  return `# ${result.headline}\n\n${result.intro}\n\n## This version\n\n${result.versionBrief.map(([key, value]) => `- **${key}:** ${value}`).join("\n")}${result.preDeckAction ? `\n\n## Do this before the deck\n\n${result.preDeckAction}` : ""}\n\n## Main pages\n\n${pages}\n\n## Why this plan\n\n${result.reasons.map((item) => `- ${item}`).join("\n")}\n\n## What the expert context changed\n\n${expert}\n\n## Useful later—not in the main path\n\n${optional}\n\n## Leave out\n\n${result.leaveOut.map((item) => `- ${item}`).join("\n")}\n\n## Assumptions and limits\n\n${result.raw.limitations.map((item) => `- ${item}`).join("\n")}\n\nGenerated locally by Deck Bones from pitch.dog.\n`;
}

history.scrollRestoration = "manual";
initialiseThreadCursor();
render(true);
