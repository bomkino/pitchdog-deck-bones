import { assessDeckBones, SECTIONS, type DeckBonesInput, type ExistingMaterial, type SectionId } from "../engine/deck-bones/index.ts";
import type { DeckAnswers, DeckPlan, PlannedSection } from "./types.ts";

const DECISIONS: Record<NonNullable<DeckAnswers["goal"]>, string> = {
  read: "read the project and decide whether to continue",
  meeting: "take a meeting about the project",
  producer: "consider joining as a producing or development partner",
  creative: "consider a real creative attachment conversation",
  funding: "consider development support or financing",
  team: "choose the next internal direction",
  specific: "review the specifically requested material",
  unsure: "choose whether to keep talking",
};
const RECIPIENTS: Record<NonNullable<DeckAnswers["recipient"]>, string> = {
  producer: "producer or development executive", director: "director", company: "production company",
  buyer: "commissioner, buyer, or platform", financier: "financier or investor", fund: "grant, lab, or fund",
  talent: "actor or talent representative", team: "your own team",
};
const ASK_NAMES: Record<NonNullable<DeckAnswers["specificAsk"]>, string> = {
  "pitch-deck": "Pitch deck", "one-pager": "One-page overview", lookbook: "Lookbook",
  "series-bible": "Series bible", treatment: "Treatment", application: "Application pack",
  unsure: "Requested Film or TV material",
};
const HEADLINES: Record<NonNullable<DeckAnswers["goal"]>, string> = {
  read: "Make them want the script.", meeting: "Earn the conversation.", producer: "Give them a reason to lean in.",
  creative: "Open the creative conversation.", funding: "Make the creative case. Mark the real unknowns.",
  team: "Make the decision visible.", specific: "Give them exactly what they asked for.", unsure: "Start with the smallest useful deck.",
};
const DELIVERY: Record<NonNullable<DeckAnswers["delivery"]>, string> = {
  live: "in a live presentation", read: "reading without you", both: "in the room and later on their own", internal: "inside your team",
};

function existingMaterials(answers: DeckAnswers): ExistingMaterial[] {
  if (!answers.materials || answers.materials === "fresh") return [];
  const story: SectionId = answers.format === "series" ? "S04" : "S03";
  if (answers.materials === "notes") return [
    { sectionId: "S01", kind: "premise notes", state: "rough" },
    { sectionId: story, kind: "story notes", state: "rough" },
  ];
  if (answers.materials === "core") return [
    { sectionId: "S01", kind: "logline or premise", state: "usable" },
    { sectionId: story, kind: "synopsis", state: "usable" },
  ];
  return (["S00", "S01", story, "S06", "S08", "S19", "S24", "S25"] as SectionId[])
    .map((sectionId) => ({ sectionId, kind: "existing deck section", state: "usable" }));
}

function toInput(answers: DeckAnswers): DeckBonesInput {
  const featureStage = answers.format === "feature" ? ({
    idea: "idea", outline: "outline", draft: "first_draft", revised: "revised", tested: "tested", packaged: "packaged",
  } as const)[answers.stage ?? "revised"] : undefined;
  const episodicStage = answers.format === "series" ? ({
    idea: "premise", outline: "outline", draft: "complete_pilot", revised: "tested_pilot", tested: "overview", packaged: "pitch_document",
  } as const)[answers.stage ?? "tested"] : undefined;
  const exactRequirements = answers.goal === "specific" && answers.specificAsk
    ? [{ id: `ask-${answers.specificAsk}`, name: ASK_NAMES[answers.specificAsk], status: "mandatory" as const }]
    : undefined;
  const boundary = answers.boundaries ?? [];
  return {
    projectKind: answers.format === "series" ? "scripted-episodic" : "scripted-feature",
    role: answers.role ?? (answers.recipient === "team" ? "team" : "writer"),
    desiredDecision: DECISIONS[answers.goal ?? "unsure"],
    recipientKind: RECIPIENTS[answers.recipient ?? "producer"],
    recipientCount: answers.recipientShape ?? "one",
    accessRoute: answers.access ?? "unknown",
    delivery: ({ live: "live", read: "read_alone", both: "leave_behind", internal: "internal" } as const)[answers.delivery ?? "read"],
    exactRequirementStatus: exactRequirements ? "current" : answers.requirementStatus ?? "none",
    exactRequirements,
    authority: boundary.includes("authority_unclear") ? "shared_unclear" : "owns_controls",
    featureStage,
    episodicStage,
    seriesShape: answers.format === "series" ? answers.seriesShape ?? "forming" : undefined,
    outsideRead: answers.outsideRead,
    deckRequested: answers.goal === "specific" || answers.materials === "deck",
    visualCaseMatters: true,
    privateOrInternal: answers.goal === "team" || answers.recipient === "team",
    liveMeeting: answers.delivery === "live",
    existingDeck: answers.materials === "deck",
    financeDecision: answers.goal === "funding" && ["financier", "fund"].includes(answers.recipient ?? ""),
    financeBasis: answers.financeBasis ?? (boundary.includes("finance_unchecked") ? "missing" : "partial"),
    talentDecision: answers.recipient === "talent",
    speculativeWork: boundary.includes("substantial_unpaid") ? "substantial_terms_unclear" : "none",
    confidentiality: boundary.includes("sensitive") ? "highly_sensitive" : "ordinary",
    imageRights: answers.visuals === "uncertain_rights" || boundary.includes("images_unclear") ? "uncertain" : answers.visuals === "none" ? "none" : "owned_or_licensed",
    deadlineBand: answers.deadline ?? "unknown",
    existingMaterials: existingMaterials(answers),
  };
}

function planned(section: ReturnType<typeof assessDeckBones>["sections"][number]): PlannedSection {
  const definition = SECTIONS[section.sectionId];
  return { ...section, name: definition?.name ?? section.sectionId, job: definition?.job ?? "Give this page one clear job." };
}

function capSections(sections: PlannedSection[], answers: DeckAnswers): PlannedSection[] {
  const story = answers.format === "series" ? "S04" : "S03";
  const compact = ["S00", "S01", story, "S08", "S11", "S24", "S25"];
  const tiny = ["S00", "S01", story, "S24", "S25"];
  if (answers.pageLimit === "under5" || answers.encounter === "under5") return sections.filter((item) => tiny.includes(item.sectionId)).slice(0, 5);
  if (answers.pageLimit === "six10" || answers.priority === "smallest" || ["read", "meeting", "unsure"].includes(answers.goal ?? "unsure")) {
    return sections.filter((item) => compact.includes(item.sectionId)).slice(0, 8);
  }
  if (answers.pageLimit === "eleven18" || answers.priority === "balanced") return sections.slice(0, 18);
  return sections;
}

function expertNotes(answers: DeckAnswers): string[] {
  const notes: string[] = [];
  if (answers.relationship === "cold") notes.push("Lead with orientation and why this project is relevant to this reader. Do not compensate with a longer biography.");
  if (answers.recipientShape === "several_different_decisions") notes.push("Make separate recipient versions. Reuse facts; do not merge different asks into one omnibus deck.");
  if (answers.delivery === "both") notes.push("Build a lean live spine and a read-alone cut. One average-density file usually makes both experiences worse.");
  if (["under5", "ten"].includes(answers.encounter ?? "")) notes.push("The live sequence is short. Put context in what you say or in a separate leave-behind—not in tiny type.");
  if (answers.seriesShape === "limited") notes.push("Prove finite progression and the landing. Do not invent future seasons to look larger.");
  if (answers.seriesShape === "returning") notes.push("Prove the pressure that creates genuinely different episodes—not an episode wallpaper list.");
  if (answers.visuals === "none") notes.push("Build the story and page jobs first. Image hunting is not permission to stall the deck.");
  if (answers.visuals === "uncertain_rights" || answers.boundaries.includes("images_unclear")) notes.push("Use owned, licensed, public-domain, or clearly marked private placeholders. The uncertain image does not travel.");
  if (answers.requirementStatus && answers.requirementStatus !== "none" && answers.requirementStatus !== "current") notes.push("Verify the exact current request before serious custom work. Memory is not a submission brief.");
  if (answers.deadline === "within_72_hours") notes.push("Reuse first. Cut optional pages. Verify the request today; do not manufacture polish with unsupported claims.");
  if (answers.priority === "adaptable") notes.push("Keep one factual spine, then version the opening, proof, disclosure, and ask for each real decision.");
  if (answers.goal === "funding" && answers.financeBasis !== "qualified") notes.push("Make the creative case. Keep budgets, returns, tax, recoupment, and investment claims out until qualified people own those facts.");
  return notes;
}

export function buildDeckPlan(answers: DeckAnswers): DeckPlan {
  const input = toInput(answers);
  const raw = assessDeckBones(input);
  const imageOnly = (answers.visuals === "uncertain_rights" || answers.boundaries.includes("images_unclear")) && raw.outcome.id === "O-U11";
  const structural = imageOnly ? assessDeckBones({ ...input, imageRights: "owned_or_licensed" }) : raw;
  const required = structural.sections.filter((item) => !["excluded", "optional", "appendix"].includes(item.state)).map(planned);
  const sections = capSections(required, answers);
  const optional = [
    ...required.filter((item) => !sections.some((kept) => kept.sectionId === item.sectionId)),
    ...structural.sections.filter((item) => ["optional", "appendix"].includes(item.state)).map(planned),
  ].filter((item, index, all) => all.findIndex((other) => other.sectionId === item.sectionId) === index);
  const noPages = sections.length === 0;
  const rehearsal = noPages && raw.outcome.kind === "rehearsal";
  const recipient = RECIPIENTS[answers.recipient ?? "producer"];
  const delivery = DELIVERY[answers.delivery ?? "read"];
  const deliveryLabel = answers.delivery ? delivery : "read-alone · quick-route default";
  const deliveryAssumption = answers.delivery ? "" : " The quick route uses a conservative read-alone default; expert mode distinguishes live, leave-behind, and internal use.";
  const headline = noPages && answers.goal === "funding" ? "Do not invent the money slide."
    : rehearsal ? "Stop adding. Rehearse the decision."
    : raw.outcome.kind === "stop" ? "The deck can wait. Do this first."
    : noPages ? raw.outcome.headline : HEADLINES[answers.goal ?? "unsure"];
  const intro = imageOnly && !noPages
    ? `Keep building the structure for a ${recipient} ${delivery}. Use an owned image or a marked private placeholder; the uncertain asset does not get to freeze the work.`
    : rehearsal ? `The usable material already exists. Rehearse it for a ${recipient} ${delivery}. Add a page only when rehearsal exposes a decision-critical gap.`
    : raw.outcome.kind === "stop" || noPages ? raw.explanation.because[0] ?? "One smaller piece of work will help more than a deck right now."
    : `A ${sections.length}-page ${answers.format === "series" ? "series" : "feature"} plan for a ${recipient} ${delivery}. Each page has one job.${deliveryAssumption}`;
  const reasons = noPages ? [raw.explanation.because[0] ?? "A prerequisite comes first.", ...(raw.tasks[0]?.doneWhen.slice(0, 1) ?? [])] : [
    answers.goal === "specific" ? "The current requested item sets the boundary. Useful extras do not outrank it." : `This version has one job: help a ${recipient} ${DECISIONS[answers.goal ?? "unsure"]}.`,
    answers.format === "series" ? "A series deck must show life beyond the pilot." : "A feature deck must make the complete story movement graspable.",
    answers.materials === "fresh" ? "Every page must earn the work it creates." : "Reuse useful material before inventing more work.",
    ...(!answers.delivery ? ["Delivery is not asked on the quick route. This plan defaults to a read-alone version so the pages carry their own context."] : []),
  ];
  const preDeckAction = noPages ? raw.tasks[0]?.action ?? "Complete the next bounded piece of work, then return to the deck." : undefined;
  return {
    raw, headline, intro, sections, optional, reasons,
    expertNotes: expertNotes(answers),
    versionBrief: [
      ["Project", answers.format === "series" ? "Scripted series" : "Scripted feature"],
      ["For", recipient], ["Decision", DECISIONS[answers.goal ?? "unsure"]], ["Delivery", deliveryLabel],
      ["Shape", noPages ? "Do the prerequisite first" : `${sections.length} main pages + ${optional.length} parked options`],
    ],
    leaveOut: [
      "Taglines pretending to be loglines.",
      "Trauma presented as proof that a creator deserves to tell the story.",
      "Names, rights, budgets, attachments, or interest that are not confirmed.",
      "Any page that does not help this reader make this decision.",
    ],
    preDeckAction,
  };
}
